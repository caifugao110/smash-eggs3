@echo off
setlocal
cd /d "%~dp0"
title Smash Eggs - Local Server

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is required. Install Node.js and run this file again.
  pause
  exit /b 1
)

set "PYTHON="
where py >nul 2>nul
if not errorlevel 1 set "PYTHON=py -3"
if not defined PYTHON (
  where python >nul 2>nul
  if not errorlevel 1 set "PYTHON=python"
)

if not exist ".venv\Scripts\python.exe" (
  if not defined PYTHON (
    echo [WARN] Python was not found. Device speech will be used instead.
    goto start_server
  )
  echo [SETUP] Creating the local speech environment...
  %PYTHON% -m venv ".venv"
  if errorlevel 1 (
    echo [WARN] Could not create the speech environment. Device speech will be used.
    goto start_server
  )
)

if exist ".venv\Scripts\python.exe" (
  echo [SETUP] Checking neural speech dependencies...
  ".venv\Scripts\python.exe" -m pip install --disable-pip-version-check -r "requirements.txt"
  if errorlevel 1 echo [WARN] Speech setup failed. Device speech will be used instead.
)

:start_server
set "PYTHONUTF8=1"
echo.
echo [START] Keep this window open while using the game.
echo [NETWORK] Allow private networks if Windows Firewall asks for permission.
echo.
node "server.js"
if errorlevel 1 echo [ERROR] The server stopped. Check the messages above.
pause
endlocal
