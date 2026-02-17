@echo off
echo Starting Diary App...
echo.

start "Backend Server" cmd /k "cd backend && node server.js"
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Backend: http://127.0.0.1:8000
echo Frontend: http://127.0.0.1:5173
echo.

