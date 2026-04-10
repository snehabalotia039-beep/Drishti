# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

from classifier import classify_user
from decision import decide_action
from ai_generator import generate_text, generate_smart_decision
from emotion import detect_from_webcam, detect_from_base64

# Load .env
load_dotenv()

app = FastAPI(title="Drishti AI Engine")

# ================================
# CORS (allow Express backend)
# ================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ================================
# INPUT MODELS
# ================================
class Behavior(BaseModel):
    scrollSpeed: str
    timeSpent: int
    clicks: int


class Context(BaseModel):
    page: str
    section: str


class ToolInput(BaseModel):
    apiKey: str
    sessionId: str
    context: Context
    behavior: Behavior
    emotion: str = "neutral"
    useWebcam: bool = False


class EmotionInput(BaseModel):
    frame: str  # base64-encoded image from browser webcam


class SmartInput(BaseModel):
    scrollSpeed: str = "medium"
    timeSpent: int = 0
    clicks: int = 0
    emotion: str = "neutral"
    page: str = "home"
    section: str = "hero"
    frame: Optional[str] = None  # optional base64 webcam frame


class GenerateInput(BaseModel):
    scrollSpeed: str = "medium"
    timeSpent: int = 0
    clicks: int = 0
    emotion: str = "neutral"
    page: str = "home"
    section: str = "hero"


# ================================
# CONFIDENCE FUNCTION
# ================================
def calculate_confidence(user_type, emotion, time_spent, clicks):

    # Behavior score (0-1)
    behavior_score = min(1.0, (time_spent / 30) + (clicks * 0.2))

    # Emotion strength
    emotion_map = {
        "love": 0.9,
        "happy": 0.8,
        "confused": 0.6,
        "bored": 0.4,
        "neutral": 0.5
    }
    emotion_score = emotion_map.get(emotion, 0.5)

    # Rule confidence
    rule_map = {
        "engaged_user": 0.9,
        "returning_user": 0.85,
        "low_attention": 0.8,
        "normal_user": 0.6
    }
    rule_score = rule_map.get(user_type, 0.6)

    # Final confidence
    confidence = (behavior_score * 0.5) + (emotion_score * 0.3) + (rule_score * 0.2)

    return round(min(confidence, 1.0), 2)


# ================================
# ROOT
# ================================
@app.get("/")
def home():
    return {
        "message": "Drishti AI Engine Running",
        "features": [
            "Behavior Analysis",
            "Webcam Emotion Detection (base64)",
            "AI Content Generation (Groq LLM)",
            "Smart Decision Engine (LLM + Rules)",
            "Confidence Scoring"
        ],
        "endpoints": {
            "detect_emotion": "POST /detect-emotion",
            "smart_decide": "POST /smart-decide",
            "generate": "POST /generate",
            "analyze": "POST /analyze",
            "webcam_test": "GET /webcam-test"
        }
    }


# ================================
# EMOTION DETECTION (base64)
# ================================
@app.post("/detect-emotion")
def detect_emotion(data: EmotionInput):
    """
    Receives a base64-encoded webcam frame from the browser SDK.
    Returns the detected emotion using DeepFace.
    """
    print("[emotion] Received webcam frame for emotion detection")

    result = detect_from_base64(data.frame)

    return {
        "emotion": result["mapped_emotion"],
        "raw_emotion": result["raw_emotion"],
        "scores": result["scores"],
        "source": "webcam_base64"
    }


# ================================
# SMART DECIDE (LLM + Rules)
# ================================
@app.post("/smart-decide")
def smart_decide(data: SmartInput):
    """
    The main integration endpoint. Combines:
    1. Webcam emotion detection (if frame provided)
    2. Behavior classification
    3. Rule-based decision
    4. LLM-powered smart decision with reasoning
    5. Confidence scoring
    
    This is what the Express backend calls for full AI-powered decisions.
    """

    # ── Step 1: Emotion (from frame or manual) ──
    emotion = data.emotion
    emotion_source = "manual"

    if data.frame:
        print("[webcam] Detecting emotion from webcam frame...")
        emotion_result = detect_from_base64(data.frame)
        emotion = emotion_result["mapped_emotion"]
        emotion_source = "webcam"
        print(f"   Detected: {emotion}")

    # ── Step 2: Classify user ──
    user_data = {
        "scroll_speed": data.scrollSpeed,
        "time_on_page": data.timeSpent,
        "clicks": data.clicks,
        "is_returning": False,
        "emotion": emotion
    }
    user_type, _ = classify_user(user_data)

    # ── Step 3: Rule-based decision (fast fallback) ──
    rule_decision = decide_action(
        user_type=user_type,
        emotion=emotion,
        time_on_page=data.timeSpent
    )

    # ── Step 4: LLM smart decision (enhanced) ──
    try:
        smart_result = generate_smart_decision(
            user_type=user_type,
            emotion=emotion,
            scroll_speed=data.scrollSpeed,
            time_on_page=data.timeSpent,
            clicks=data.clicks,
            page=data.page,
            section=data.section
        )
    except Exception as e:
        print(f"LLM Error, falling back to rules: {e}")
        smart_result = {
            "headline": rule_decision.get("cta", "Get Started"),
            "cta": rule_decision.get("cta", "Get Started"),
            "content_type": rule_decision.get("content_type", "normal"),
            "priority": rule_decision.get("priority", "default"),
            "show_popup": rule_decision.get("show_popup", False),
            "reasoning": "Fallback to rule-based decision"
        }

    # ── Step 5: Confidence ──
    confidence = calculate_confidence(
        user_type, emotion, data.timeSpent, data.clicks
    )

    # ── Final Response ──
    return {
        "change": True,
        "headline": smart_result.get("headline", rule_decision.get("cta", "")),
        "cta": smart_result.get("cta", "Get Started"),
        "contentType": smart_result.get("content_type", "normal"),
        "priority": smart_result.get("priority", "default"),
        "showPopup": smart_result.get("show_popup", False),
        "reasoning": smart_result.get("reasoning", ""),

        "emotion": emotion,
        "emotionSource": emotion_source,
        "userType": user_type,
        "confidence": confidence,
        "source": "smart_ai"
    }


# ================================
# OPTIONAL: TEST WEBCAM (local)
# ================================
@app.get("/webcam-test")
def webcam_test():
    emotion = detect_from_webcam(duration=5)
    return {
        "emotion": emotion,
        "source": "webcam_local"
    }


# ================================
# FULL ANALYZE ENDPOINT
# ================================
@app.post("/analyze")
def analyze(data: ToolInput):

    # ── Step 1: Emotion ──
    if data.useWebcam:
        print("[webcam] Using webcam emotion detection")
        emotion = detect_from_webcam(duration=5)
    else:
        emotion = data.emotion

    # ── Step 2: Convert Input ──
    user_data = {
        "scroll_speed": data.behavior.scrollSpeed,
        "time_on_page": data.behavior.timeSpent,
        "clicks": data.behavior.clicks,
        "is_returning": False,
        "emotion": emotion
    }

    # ── Step 3: Classification ──
    user_type, emotion = classify_user(user_data)

    # ── Step 4: Decision Engine ──
    decision = decide_action(
        user_type=user_type,
        emotion=emotion,
        time_on_page=user_data["time_on_page"]
    )

    # ── Step 5: AI Generator ──
    ai_text = generate_text(user_type, emotion)

    # ── Step 6: Confidence ──
    confidence = calculate_confidence(
        user_type,
        emotion,
        user_data["time_on_page"],
        user_data["clicks"]
    )

    # ── Final Output ──
    return {
        "change": True,
        "headline": ai_text["headline"],
        "cta": ai_text["cta"],
        "contentType": decision["content_type"],

        "emotion": emotion,
        "reason": user_type,

        "confidence": confidence,
        "source": "webcam" if data.useWebcam else "manual"
    }


# ================================
# SIMPLIFIED GENERATE ENDPOINT
# (Called by Express backend)
# ================================
@app.post("/generate")
def generate(data: GenerateInput):
    """
    Simplified endpoint — accepts flat format from Express backend.
    Returns headline + cta + full decision data for the SDK.
    """
    user_data = {
        "scroll_speed": data.scrollSpeed,
        "time_on_page": data.timeSpent,
        "clicks": data.clicks,
        "is_returning": False,
        "emotion": data.emotion
    }

    user_type, emotion = classify_user(user_data)

    # Get decision from rule engine
    decision = decide_action(
        user_type=user_type,
        emotion=emotion,
        time_on_page=data.timeSpent
    )

    # Get AI-generated text
    ai_text = generate_text(user_type, emotion, data.page, data.section)

    # Calculate confidence
    confidence = calculate_confidence(
        user_type, emotion, data.timeSpent, data.clicks
    )

    return {
        "change": True,
        "headline": ai_text["headline"],
        "cta": ai_text["cta"],
        "contentType": decision["content_type"],
        "priority": decision["priority"],
        "showPopup": decision["show_popup"],
        "emotion": emotion,
        "userType": user_type,
        "confidence": confidence,
        "reason": user_type,
        "source": "ai"
    }