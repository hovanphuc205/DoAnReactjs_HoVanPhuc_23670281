@echo off
title CoffeeSpace Full-Stack Starter
echo ==================================================
echo   DANG KHOI DONG HE THONG COFFEE SPACE FULL-STACK
echo ==================================================
echo.

:: Thiet lap JAVA_HOME tu dong
set "JAVA_HOME=C:\Program Files\Java\jdk-17"

echo [1/2] Dang khoi dong Server Java REST API (Port 8080)...
start cmd /k "title Coffee REST API Server && set JAVA_HOME=C:\Program Files\Java\jdk-17&& cd backend && .\mvnw compile exec:java -Dexec.mainClass=network.RestApiServer"

echo.
echo [2/2] Dang khoi dong React Frontend (Vite)...
npm run dev

pause
