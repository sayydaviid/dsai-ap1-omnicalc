@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale Node.js 20 ou superior em https://nodejs.org/ e abra novamente.
  pause
  exit /b 1
)
node -e "if(Number(process.versions.node.split('.')[0])<20){console.error('Node.js 20 ou superior e necessario.');process.exit(1)}"
if errorlevel 1 (
  pause
  exit /b 1
)
node scripts\serve.mjs --open
pause
