@echo off
title 김현준 소개 웹서버 (http://localhost:3000)
chcp 65001 > nul
cd /d "%~dp0"

echo ========================================================
echo   [김현준 소개 페이지] 웹 서버를 시작합니다...
echo   잠시 후 기본 웹 브라우저에서 자동으로 열립니다.
echo   접속 주소: http://localhost:3000
echo   종료하려면 이 창을 닫으세요.
echo ========================================================

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 3000 -OpenBrowser
pause
