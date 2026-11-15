from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CaptionItem(BaseModel):
    id: str
    startTime: float
    endTime: float
    speaker: str = "Performer"
    text: Dict[str, str] = Field(default_factory=lambda: {"bengali": "", "hindi": "", "english": ""})
    status: str = "ai_suggested"

class MovementEventItem(BaseModel):
    id: str
    timestamp: float
    duration: float = 2.0
    poseName: str = ""
    description: str
    bodyRegion: str = "full_body"
    style: str = "literal"
    confidence: float = 0.85
    status: str = "ai_suggested"

class SceneEventItem(BaseModel):
    id: str
    timestamp: float
    lightingCue: str = ""
    spatialFocus: str = "center_stage"
    description: str
    status: str = "ai_suggested"

class SoundEventItem(BaseModel):
    id: str
    timestamp: float
    instrumentOrCue: str = ""
    intensity: str = "moderate"
    description: str
    status: str = "ai_suggested"

class HapticCueItem(BaseModel):
    id: str
    timestamp: float
    durationMs: int = 200
    intensity: int = 75
    pattern: List[int] = Field(default_factory=lambda: [200])
    patternType: str = "pulse"
    label: str = "Rhythm Cue"
    associatedEventId: str = ""
    status: str = "ai_suggested"

class AccessibilityDescriptionItem(BaseModel):
    id: str
    timestamp: float
    duration: float = 3.5
    style: str = "literal"
    text: Dict[str, str] = Field(default_factory=lambda: {"bengali": "", "hindi": "", "english": ""})
    audioUrl: Dict[str, str] = Field(default_factory=lambda: {"bengali": "", "hindi": "", "english": ""})
    status: str = "ai_suggested"

class AnalysisRequest(BaseModel):
    performanceId: str
    videoUrl: str
    title: str = "Performance"
    category: str = "Dance"
    originalLanguage: str = "Bengali"
    additionalLanguages: List[str] = ["Hindi", "English"]
    culturalContext: Optional[str] = "Bengali Classical & Folk Traditions"

class AnalysisResponse(BaseModel):
    performanceId: str
    status: str
    processingTimeSeconds: float
    sourceVideo: str
    modelEngine: str
    timeline: Dict[str, Any]
    metadata: Dict[str, Any]
