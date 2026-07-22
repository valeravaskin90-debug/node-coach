@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
title Publish Node Coach CS to GitHub Pages

echo ============================================================
echo NODE COACH CS - GITHUB PAGES PUBLISHER
echo ============================================================
echo.

where winget.exe >nul 2>nul
if errorlevel 1 (
  echo [WARNING] winget was not found.
  echo Git and GitHub CLI must be installed manually.
)

where git.exe >nul 2>nul
if errorlevel 1 (
  echo Git was not found.
  where winget.exe >nul 2>nul
  if errorlevel 1 goto NO_GIT
  echo Installing Git...
  winget install --id Git.Git -e --source winget
  if errorlevel 1 goto NO_GIT
  echo.
  echo Git was installed. Close this window and run the script again.
  pause
  exit /b 0
)

where gh.exe >nul 2>nul
if errorlevel 1 (
  echo GitHub CLI was not found.
  where winget.exe >nul 2>nul
  if errorlevel 1 goto NO_GH
  echo Installing GitHub CLI...
  winget install --id GitHub.cli -e --source winget
  if errorlevel 1 goto NO_GH
  echo.
  echo GitHub CLI was installed. Close this window and run the script again.
  pause
  exit /b 0
)

echo [1/8] GitHub authentication
gh auth status --hostname github.com >nul 2>nul
if errorlevel 1 (
  echo A browser window will open for GitHub authentication.
  gh auth login --hostname github.com --git-protocol https --web
  if errorlevel 1 goto AUTH_FAIL
)

gh auth setup-git --hostname github.com >nul 2>nul

for /f "usebackq delims=" %%i in (`gh api user --jq ".login"`) do set "OWNER=%%i"
if not defined OWNER goto AUTH_FAIL

echo Logged in as: %OWNER%
echo.

set "REPO=node-coach-cs"
set /p "REPO=Repository prefix [node-coach-cs]: "
if not defined REPO set "REPO=node-coach-cs"

echo.
echo Site address will be:
echo   https://%OWNER%.github.io/%REPO%/
echo.
choice /C YN /M "Continue"
if errorlevel 2 exit /b 0

echo.
echo [2/8] Preparing Git repository
if not exist ".git" (
  git init
  if errorlevel 1 goto GIT_FAIL
)

git checkout -B main
git config user.name "%OWNER%"
git config user.email "%OWNER%@users.noreply.github.com"

echo [3/8] Creating commit
git add .
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Publish Node Coach CS website"
  if errorlevel 1 goto GIT_FAIL
) else (
  echo No new file changes to commit.
)

echo [4/8] Checking GitHub repository
gh repo view "%OWNER%/%REPO%" >nul 2>nul
if errorlevel 1 (
  echo Creating public repository %OWNER%/%REPO%...
  gh repo create "%OWNER%/%REPO%" --public --description "Node Coach CS - local post-match analytics for Counter-Strike 2" --source "." --remote origin
  if errorlevel 1 goto REPO_FAIL
) else (
  echo Repository already exists.
  git remote get-url origin >nul 2>nul
  if errorlevel 1 (
    git remote add origin "https://github.com/%OWNER%/%REPO%.git"
  ) else (
    git remote set-url origin "https://github.com/%OWNER%/%REPO%.git"
  )
)

echo [5/8] Pushing main branch
git push -u origin main
if errorlevel 1 goto PUSH_FAIL

echo [6/8] Enabling GitHub Pages
gh api --method POST "repos/%OWNER%/%REPO%/pages" -f build_type=workflow >nul 2>nul
if errorlevel 1 (
  echo Pages may already be enabled. Attempting workflow mode update...
  gh api --method PUT "repos/%OWNER%/%REPO%/pages" -f build_type=workflow >nul 2>nul
)

echo [7/8] Setting repository homepage
gh repo edit "%OWNER%/%REPO%" --homepage "https://%OWNER%.github.io/%REPO%/" >nul 2>nul

echo [8/8] Opening GitHub Actions and future site
echo %OWNER%>%~dp0.publish_state.txt
echo %REPO%>>%~dp0.publish_state.txt

start "" "https://github.com/%OWNER%/%REPO%/actions"
timeout /t 3 >nul
start "" "https://%OWNER%.github.io/%REPO%/"

echo.
echo ============================================================
echo PUBLISH COMPLETED
echo ============================================================
echo Repository:
echo   https://github.com/%OWNER%/%REPO%
echo.
echo Site:
echo   https://%OWNER%.github.io/%REPO%/
echo.
echo First deployment usually needs a few minutes.
echo Open the Actions tab to watch the deployment.
pause
exit /b 0

:NO_GIT
echo.
echo [ERROR] Git is required.
echo Install: https://git-scm.com/download/win
goto END_FAIL

:NO_GH
echo.
echo [ERROR] GitHub CLI is required.
echo Install: https://cli.github.com/
goto END_FAIL

:AUTH_FAIL
echo.
echo [ERROR] GitHub authentication failed.
goto END_FAIL

:GIT_FAIL
echo.
echo [ERROR] Local Git operation failed.
goto END_FAIL

:REPO_FAIL
echo.
echo [ERROR] GitHub repository could not be created.
goto END_FAIL

:PUSH_FAIL
echo.
echo [ERROR] Files could not be pushed.
echo Check GitHub authentication and repository permissions.
goto END_FAIL

:END_FAIL
pause
exit /b 1
