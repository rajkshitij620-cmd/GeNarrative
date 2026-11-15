# RASA CUE – INSTALLATION, LOCAL SETUP & DEPLOYMENT

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Python**: 3.9+ or 3.11+
- **npm**: 9.0+

---

## 2. Fast 1-Click Local Setup

Run the following commands in the project root:

```bash
# 1. Install Node.js backend dependencies
cd backend
npm install
cp .env.example .env

# 2. Install React frontend dependencies
cd ../frontend
npm install
cp .env.example .env

# 3. Create Python virtual environment for AI microservice
cd ../ai-service
python3 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt
cp .env.example .env
```

---

## 3. Starting All Three Services

Open three terminal windows (or use background processes):

### Terminal 1: Main Express Backend
```bash
cd backend
npm start
# Runs on http://localhost:5001
```

### Terminal 2: FastAPI AI Microservice
```bash
cd ai-service
./venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# Runs on http://localhost:8000 (Swagger docs: http://localhost:8000/docs)
```

### Terminal 3: Vite React Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 4. Environment Variables Configuration

### `backend/.env`
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/rasa_cue  # Optional: falls back to in-memory store if unset
JWT_SECRET=your_jwt_secret_key_2026
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://127.0.0.1:8000
NODE_ENV=development
```

### `ai-service/.env`
```env
PORT=8000
HOST=0.0.0.0
# Optional Gemini API key (Cultural fallback pipeline activates automatically if unset)
GEMINI_API_KEY=your_gemini_api_key_here
```

### `frontend/.env`
```env
VITE_API_URL=/api
```

---

## 5. Production Build & Deployment

### Frontend Production Build
```bash
cd frontend
npm run build
# Generates optimized static assets in frontend/dist/
```

### Deploying to Render / Railway / Heroku
- Deploy `backend/` as a Node web service.
- Deploy `ai-service/` as a Python web service.
- Set `AI_SERVICE_URL` in backend to the deployed FastAPI URL.
- Deploy `frontend/dist/` to Vercel, Netlify, or serve statically from Express.
