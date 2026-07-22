@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Update Node Coach CS GitHub Pages

if not exist ".git" (
  echo This folder was not published yet.
  echo Run PUBLISH_TO_GITHUB.cmd first.
  pause
  exit /b 1
)

where git.exe >nul 2>nul
if errorlevel 1 (
  echo Git was not found.
  pause
  exit /b 1
)

git add .
git diff --cached --quiet
if not errorlevel 1 (
  echo No changes to publish.
  pause
  exit /b 0
)

git commit -m "Update Node Coach CS website"
if errorlevel 1 goto FAIL
git push
if errorlevel 1 goto FAIL

echo.
echo Website update was pushed.
echo GitHub Actions will deploy it automatically.
pause
exit /b 0

:FAIL
echo.
echo Update failed.
pause
exit /b 1
