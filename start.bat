@echo off
setlocal
title YELLOW: THE ESCAPE - 3D Survival Horror
echo ======================================================================
echo    YELLOW: THE ESCAPE - 3D Survival Horror Escape Game
echo ======================================================================
echo.
echo Starting Vite Web Server...
echo Buka browser di http://localhost:5173 jika tidak terbuka otomatis.
echo.

where node >nul 2>&1
if %ERRORLEVEL% equ 0 (
  node node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173 --open
) else (
  "C:\Users\ariya\AppData\Roaming\Antigravity\bin\agy-node.cmd" node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173 --open
)

pause
