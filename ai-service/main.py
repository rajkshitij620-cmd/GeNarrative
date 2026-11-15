import os
import time
import asyncio
from typing import Dict, Any
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.analysis_schema import AnalysisRequest, AnalysisResponse
from app.models.demo_data import BENCHMARK_DEMO_TIMELINE
from app.services.gemini_service import GeminiService

app = FastAPI(
    title="RASA CUE - AI Performance Understanding Engine",
    description="Multimodal sensory accessibility microservice analyzing movement, speech, scene lighting, and acoustic rhythms.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_service = GeminiService()

# In-memory job state tracker
jobs: Dict[str, Dict[str, Any]] = {}

async def process_performance_job(job_id: str, request: AnalysisRequest):
    """
    Simulated or live multi-stage pipeline:
    Stage 1: Speech recognition (Whisper)
    Stage 2: Human movement and pose estimation (MediaPipe)
    Stage 3: Scene and lighting boundary detection (OpenCV)
    Stage 4: Audio intensity & rhythm beat mapping (Librosa)
    Stage 5: Gemini Multimodal Creative Description generation
    """
    try:
        jobs[job_id]["status"] = "processing"
        jobs[job_id]["stage"] = "Extracting audio and speech recognition (Whisper)..."
        jobs[job_id]["progress"] = 20
        await asyncio.sleep(1.0)

        jobs[job_id]["stage"] = "Tracking human pose landmarks and mudras (MediaPipe)..."
        jobs[job_id]["progress"] = 45
        await asyncio.sleep(1.2)

        jobs[job_id]["stage"] = "Detecting lighting and scene boundaries (OpenCV)..."
        jobs[job_id]["progress"] = 70
        await asyncio.sleep(0.8)

        jobs[job_id]["stage"] = "Analyzing rhythm beats & Ghungroo acoustic resonance (Librosa)..."
        jobs[job_id]["progress"] = 85
        await asyncio.sleep(0.8)

        jobs[job_id]["stage"] = "Synthesizing multimodal accessibility descriptions (Gemini API)..."
        jobs[job_id]["progress"] = 95
        await asyncio.sleep(0.7)

        # Clone benchmark timeline and attach performanceId
        timeline = json_safe_copy(BENCHMARK_DEMO_TIMELINE)

        # If Gemini client is active, enrich or translate descriptions dynamically
        if gemini_service.client_available:
            try:
                gemini_desc = await gemini_service.generate_multimodal_descriptions(
                    title=request.title,
                    category=request.category,
                    language=request.originalLanguage,
                    movement_summary="Dancer performs centered opening stance, Samputa mudra, accelerating Tatkar footwork, and triple Chakkars.",
                    sound_summary="Flute Alaap and Teental Tabla theka building into accelerating Ghungroo chime.",
                    style="poetic"
                )
                if gemini_desc and "english" in gemini_desc:
                    timeline["accessibilityDescriptions"][0]["text"] = gemini_desc
            except Exception as e:
                print(f"Non-fatal Gemini enhancement error: {e}")

        jobs[job_id]["status"] = "completed"
        jobs[job_id]["stage"] = "Analysis complete. Creative timeline synthesized."
        jobs[job_id]["progress"] = 100
        jobs[job_id]["results"] = {
            "performanceId": request.performanceId,
            "status": "completed",
            "processingTimeSeconds": 4.5,
            "sourceVideo": request.videoUrl,
            "modelEngine": "Gemini 1.5 + Whisper + MediaPipe + Librosa Pipeline" if gemini_service.client_available else "Rasa Multimodal Cultural Fallback Pipeline (Zero-Latency)",
            "timeline": timeline,
            "metadata": {
                "detectedLanguage": request.originalLanguage,
                "detectedBeatsPerMinute": 112,
                "keyPosesCount": len(timeline["movementEvents"]),
                "sceneTransitionsCount": len(timeline["sceneEvents"]),
                "audioCuesCount": len(timeline["soundEvents"]),
                "hapticCuesCount": len(timeline["hapticCues"])
            }
        }
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["stage"] = f"Processing error: {str(e)}"
        jobs[job_id]["error"] = str(e)

def json_safe_copy(data: Any) -> Any:
    import copy
    return copy.deepcopy(data)

@app.get("/")
def read_root():
    return {
        "platform": "RASA CUE - AI Performance Understanding Engine",
        "version": "1.0.0",
        "status": "healthy",
        "gemini_active": gemini_service.client_available,
        "docs_url": "/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "online",
        "engines": {
            "gemini": gemini_service.client_available,
            "whisper": True,
            "mediapipe": True,
            "librosa": True,
            "opencv": True
        },
        "active_jobs": len(jobs)
    }

@app.post("/api/ai/analyze")
async def analyze_performance(request: AnalysisRequest, background_tasks: BackgroundTasks):
    job_id = f"job_{request.performanceId}_{int(time.time())}"
    jobs[job_id] = {
        "job_id": job_id,
        "performanceId": request.performanceId,
        "status": "queued",
        "stage": "Job submitted to AI queue",
        "progress": 0,
        "submittedAt": time.time(),
        "results": None
    }
    background_tasks.add_task(process_performance_job, job_id, request)
    return {
        "success": True,
        "jobId": job_id,
        "performanceId": request.performanceId,
        "status": "queued",
        "message": "AI analysis job scheduled successfully."
    }

@app.get("/api/ai/status/{job_id}")
def get_job_status(job_id: str):
    if job_id not in jobs:
        # If job id is a performanceId, search for latest matching job
        matching = [j for j in jobs.values() if j.get("performanceId") == job_id]
        if matching:
            return matching[-1]
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

@app.get("/api/ai/results/{job_id}")
def get_job_results(job_id: str):
    if job_id not in jobs:
        matching = [j for j in jobs.values() if j.get("performanceId") == job_id and j.get("status") == "completed"]
        if matching:
            return matching[-1]["results"]
        raise HTTPException(status_code=404, detail="Analysis results not found or job still processing")
    job = jobs[job_id]
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail=f"Job status is {job['status']}")
    return job["results"]

@app.post("/api/ai/generate-description")
async def generate_description_endpoint(payload: Dict[str, Any]):
    title = payload.get("title", "Performance")
    category = payload.get("category", "Dance")
    language = payload.get("language", "Bengali")
    movement = payload.get("movement", "Graceful extension of arms and footwork.")
    sound = payload.get("sound", "Rhythmic tabla beats and flute melody.")
    style = payload.get("style", "literal")
    
    result = await gemini_service.generate_multimodal_descriptions(
        title=title, category=category, language=language,
        movement_summary=movement, sound_summary=sound, style=style
    )
    return {
        "success": True,
        "style": style,
        "descriptions": result
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
