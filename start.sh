#!/bin/bash

# RASA CUE – All-in-one local runner script

echo "=================================================="
echo "🎭 Starting RASA CUE Platform Services..."
echo "=================================================="

# Function to kill all background processes on exit
cleanup() {
  echo ""
  echo "Stopping all RASA CUE services..."
  kill $(jobs -p) 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Start AI Microservice (Port 8000)
echo "1️⃣  Starting Python FastAPI AI Microservice on Port 8000..."
cd "$ROOT_DIR/ai-service"
./venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
AI_PID=$!

sleep 1

# 2. Start Express Backend (Port 5001)
echo "2️⃣  Starting Express Backend on Port 5001..."
cd "$ROOT_DIR/backend"
node --watch src/server.js &
BE_PID=$!

sleep 1

# 3. Start React Vite Frontend (Port 5173)
echo "3️⃣  Starting React Vite Frontend on Port 5173..."
cd "$ROOT_DIR/frontend"
npm run dev &
FE_PID=$!

echo ""
echo "=================================================="
echo "✅ All RASA CUE Services are running!"
echo "👉 Web App (Frontend):     http://localhost:5173"
echo "👉 Backend API:            http://localhost:5001/api/health"
echo "👉 AI Engine Docs:         http://localhost:8000/docs"
echo "👉 Live Demo Performance:  http://localhost:5173/experience/rituranga-spring-dance"
echo "=================================================="
echo "Press Ctrl + C anytime to stop all servers."
echo ""

wait
