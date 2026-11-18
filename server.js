const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');
const { spawn } = require('child_process');

const root = __dirname;
const port = 8123;
const python = path.join(root, '.venv', process.platform === 'win32' ? 'Scripts' : 'bin', process.platform === 'win32' ? 'python.exe' : 'python');
const cacheDir = path.join(root, '.cache', 'tts');
const voices = new Set([
  'zh-CN-YunxiaNeural',
  'zh-CN-XiaoxiaoNeural',
  'zh-CN-XiaoyiNeural',
  'zh-CN-YunxiNeural'
]);
const pending = new Map();
const waiters = [];
let activeSynthesis = 0;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function readBody(req) {
  return new Promise(function (resolve, reject) {
    let body = '';
    let tooLarge = false;
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
      if (tooLarge) return;
      body += chunk;
      if (Buffer.byteLength(body) > 16384) tooLarge = true;
    });
    req.on('end', function () {
      if (tooLarge) reject(httpError(413, '文本过长'));
      else resolve(body);
    });
    req.on('error', reject);
  });
}

function acquireSlot() {
  if (activeSynthesis < 2) {
    activeSynthesis++;
    return Promise.resolve();
  }
  return new Promise(function (resolve) { waiters.push(resolve); });
}

function releaseSlot() {
  const next = waiters.shift();
  if (next) next();
  else activeSynthesis--;
}

function runEdgeTts(text, voice, rate, tempFile) {
  return new Promise(function (resolve, reject) {
    const rateArg = (rate >= 0 ? '+' : '') + rate + '%';
    const child = spawn(python, [
      '-m', 'edge_tts',
      '--voice', voice,
      '--rate=' + rateArg,
      '--text', text,
      '--write-media', tempFile
    ], {
      shell: false,
      windowsHide: true,
      env: Object.assign({}, process.env, { PYTHONUTF8: '1' })
    });
    let stderr = '';
    let timedOut = false;
    let settled = false;
    const timer = setTimeout(function () {
      timedOut = true;
      child.kill();
    }, 30000);

    function finish(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve();
    }

    child.stderr.on('data', function (chunk) {
      if (stderr.length < 4000) stderr += chunk.toString();
    });
    child.on('error', function (error) {
      finish(httpError(error.code === 'ENOENT' ? 503 : 502, '语音环境不可用'));
    });
    child.on('close', function (code) {
      if (timedOut) finish(httpError(504, '语音合成超时'));
      else if (code !== 0) {
        console.error('[tts]', stderr.trim().slice(0, 1000) || 'edge-tts exited with ' + code);
        finish(httpError(502, '语音合成失败'));
      } else finish();
    });
  });
}

async function cacheExists(file) {
  try {
    const stat = await fs.promises.stat(file);
    return stat.isFile() && stat.size > 0;
  } catch (error) {
    return false;
  }
}

async function createAudio(key, text, voice, rate) {
  const file = path.join(cacheDir, key + '.mp3');
  if (await cacheExists(file)) return { file: file, cached: true };

  await acquireSlot();
  const tempFile = path.join(cacheDir, key + '-' + process.pid + '-' + Date.now() + '.tmp');
  try {
    if (await cacheExists(file)) return { file: file, cached: true };
    await fs.promises.mkdir(cacheDir, { recursive: true });
    await runEdgeTts(text, voice, rate, tempFile);
    if (!await cacheExists(tempFile)) throw httpError(502, '语音文件为空');
    await fs.promises.rename(tempFile, file);
    return { file: file, cached: false };
  } finally {
    releaseSlot();
    fs.promises.unlink(tempFile).catch(function () {});
  }
}

async function getAudio(text, voice, rate) {
  const key = crypto.createHash('sha256').update(JSON.stringify(['v1', text, voice, rate])).digest('hex');
  if (pending.has(key)) return pending.get(key);
  const task = createAudio(key, text, voice, rate);
  pending.set(key, task);
  try {
    return await task;
  } finally {
    pending.delete(key);
  }
}

async function handleTts(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: '仅支持 POST' });
    return;
  }

  try {
    const raw = await readBody(req);
    let input;
    try {
      input = JSON.parse(raw || '{}');
    } catch (error) {
      throw httpError(400, 'JSON 格式错误');
    }
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw httpError(400, '请求须为 JSON 对象');

    const text = typeof input.text === 'string' ? input.text.trim() : '';
    const voice = input.voice;
    const speed = input.rate === undefined ? 1 : input.rate;
    if (!text || text.length > 200 || /[\u0000-\u001f\u007f]/.test(text)) {
      throw httpError(400, '文本须为 1–200 字且不含控制字符');
    }
    if (!voices.has(voice)) throw httpError(400, '不支持的音色');
    if (typeof speed !== 'number' || !Number.isFinite(speed) || speed < 0.5 || speed > 1.3) {
      throw httpError(400, '语速范围为 0.5–1.3');
    }

    const rate = Math.round((speed - 1) * 100);
    const result = await getAudio(text, voice, rate);
    const audio = await fs.promises.readFile(result.file);
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': audio.length,
      'Cache-Control': 'no-store',
      'X-TTS-Cache': result.cached ? 'HIT' : 'MISS'
    });
    res.end(audio);
  } catch (error) {
    const status = error.status || 500;
    if (status === 500) console.error('[tts]', error);
    if (!res.headersSent) sendJson(res, status, { error: status === 500 ? '服务器错误' : error.message });
  }
}

function serveStatic(req, res, urlPath) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end('method not allowed');
    return;
  }
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.resolve(root, '.' + urlPath);
  const relative = path.relative(root, file);
  const firstPart = relative.split(path.sep)[0].toLowerCase();
  if (!relative || relative.startsWith('..' + path.sep) || relative === '..' || path.isAbsolute(relative)) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }
  if (['.git', '.venv', '.cache', '.trae'].includes(firstPart)) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }

  fs.readFile(file, function (error, data) {
    if (error) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': data.length
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}

const server = http.createServer(function (req, res) {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (error) {
    res.writeHead(400);
    res.end('bad request');
    return;
  }
  if (urlPath.includes('\0')) {
    res.writeHead(400);
    res.end('bad request');
    return;
  }
  if (urlPath === '/api/tts') handleTts(req, res);
  else serveStatic(req, res, urlPath);
});

server.listen(port, '0.0.0.0', function () {
  console.log('本机访问: http://127.0.0.1:' + port);
  const interfaces = os.networkInterfaces();
  Object.keys(interfaces).forEach(function (name) {
    (interfaces[name] || []).forEach(function (item) {
      const ipv4 = item.family === 'IPv4' || item.family === 4;
      if (ipv4 && !item.internal) console.log('局域网访问: http://' + item.address + ':' + port);
    });
  });
  if (!fs.existsSync(python)) console.log('提示: 未找到语音环境，请使用 start.bat 自动安装。');
});
