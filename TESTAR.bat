@echo off
chcp 65001 >nul
cd /d "%~dp0"
node scripts\verify.mjs
if errorlevel 1 (
  echo A verificacao encontrou um problema. Consulte reports\tests.tap.txt.
) else (
  echo Verificacao concluida com sucesso.
)
pause
