@echo off
echo ========================================
echo  InsightShare - Build de Extensoes
echo ========================================
echo.

:menu
echo Escolha o navegador:
echo 1. Chrome
echo 2. Edge
echo 3. Firefox
echo 4. Todos
echo 5. Sair
echo.
set /p choice="Digite sua escolha (1-5): "

if "%choice%"=="1" goto chrome
if "%choice%"=="2" goto edge
if "%choice%"=="3" goto firefox
if "%choice%"=="4" goto all
if "%choice%"=="5" goto end
goto menu

:chrome
echo.
echo Preparando extensao para Chrome...
copy manifest.json manifest-backup.json >nul 2>&1
echo Extensao Chrome pronta!
echo Carregue a pasta 'browser-extension' no Chrome
echo.
pause
goto menu

:edge
echo.
echo Preparando extensao para Edge...
copy manifest.json manifest-backup.json >nul 2>&1
copy manifest-edge.json manifest.json
echo Extensao Edge pronta!
echo Carregue a pasta 'browser-extension' no Edge
echo.
pause
copy manifest-backup.json manifest.json >nul 2>&1
goto menu

:firefox
echo.
echo Preparando extensao para Firefox...
copy manifest.json manifest-backup.json >nul 2>&1
copy popup.html popup-backup.html >nul 2>&1
copy popup.js popup-backup.js >nul 2>&1

copy manifest-firefox.json manifest.json
copy popup-firefox.html popup.html
copy popup-firefox.js popup.js

echo Extensao Firefox pronta!
echo Carregue o arquivo 'manifest.json' no Firefox
echo.
pause

copy manifest-backup.json manifest.json >nul 2>&1
copy popup-backup.html popup.html >nul 2>&1
copy popup-backup.js popup.js >nul 2>&1
goto menu

:all
echo.
echo Criando pacotes para todos os navegadores...
echo.

REM Chrome
echo [1/3] Criando pacote Chrome...
if not exist "dist" mkdir dist
if not exist "dist\chrome" mkdir dist\chrome
xcopy /E /I /Y *.* dist\chrome\ >nul 2>&1
xcopy /E /I /Y icons dist\chrome\icons\ >nul 2>&1
echo Chrome: dist\chrome\

REM Edge
echo [2/3] Criando pacote Edge...
if not exist "dist\edge" mkdir dist\edge
xcopy /E /I /Y *.* dist\edge\ >nul 2>&1
xcopy /E /I /Y icons dist\edge\icons\ >nul 2>&1
copy manifest-edge.json dist\edge\manifest.json >nul 2>&1
echo Edge: dist\edge\

REM Firefox
echo [3/3] Criando pacote Firefox...
if not exist "dist\firefox" mkdir dist\firefox
xcopy /E /I /Y *.* dist\firefox\ >nul 2>&1
xcopy /E /I /Y icons dist\firefox\icons\ >nul 2>&1
copy manifest-firefox.json dist\firefox\manifest.json >nul 2>&1
copy popup-firefox.html dist\firefox\popup.html >nul 2>&1
copy popup-firefox.js dist\firefox\popup.js >nul 2>&1
copy background-firefox.js dist\firefox\background.js >nul 2>&1
echo Firefox: dist\firefox\

echo.
echo Todos os pacotes criados em 'dist\'!
echo.
pause
goto menu

:end
echo.
echo Ate logo!
exit /b
