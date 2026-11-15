import os
import json
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("rasa_ai.gemini")

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip().strip('"').strip("'")
        if not self.api_key:
            env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
            if os.path.exists(env_path):
                with open(env_path, "r") as f:
                    for line in f:
                        if line.strip().startswith("GEMINI_API_KEY="):
                            val = line.split("=", 1)[1].strip().strip('"').strip("'")
                            if val:
                                self.api_key = val
                                break

        self.client_available = False
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                # Try contemporary flash models in order of availability
                for model_name in ["gemini-3.8-flash", "gemini-flash-latest", "gemini-1.5-flash"]:
                    try:
                        self.model = genai.GenerativeModel(model_name)
                        self.client_available = True
                        logger.info(f"Gemini API configured with model: {model_name}")
                        break
                    except Exception:
                        continue
            except Exception as e:
                logger.warning(f"Could not initialize Gemini API: {e}")
                self.client_available = False

    async def generate_multimodal_descriptions(
        self,
        title: str,
        category: str,
        language: str,
        movement_summary: str,
        sound_summary: str,
        style: str = "literal"
    ) -> Dict[str, str]:
        """
        Generate contextual audio and visual descriptions in 3 languages.
        Styles supported: Literal, Poetic, Minimal.
        """
        if not self.client_available:
            return self._fallback_descriptions(title, category, movement_summary, style)

        prompt = f"""
You are an expert accessibility consultant and cultural arts audio describer for the RASA CUE platform.
Analyze this performance moment and generate an accessible description for visually impaired audiences.

Performance: {title} ({category})
Original Language: {language}
Movement Context: {movement_summary}
Musical/Sound Context: {sound_summary}
Style Requested: {style} (Literal = precise physical actions; Poetic = evocative emotional imagery; Minimal = concise essential cue).

Provide output in JSON format with exactly these keys:
{{
  "english": "description in English",
  "bengali": "description in Bengali",
  "hindi": "description in Hindi"
}}
"""
        try:
            response = self.model.generate_content(prompt)
            raw_text = response.text.strip()
            # Clean JSON formatting
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_text:
                raw_text = raw_text.split("```")[1].split("```")[0].strip()
            return json.loads(raw_text)
        except Exception as e:
            logger.error(f"Gemini generation error: {e}")
            return self._fallback_descriptions(title, category, movement_summary, style)

    def _fallback_descriptions(self, title: str, category: str, movement: str, style: str) -> Dict[str, str]:
        if style == "poetic":
            return {
                "bengali": f"শরীরের মন্দ্রিত ছন্দে বসন্তের আগমনী ধ্বনি ফুটে উঠছে; প্রতিটি অঙ্গভঙ্গি এক চিরন্তন আখ্যান।",
                "hindi": f"शरीर की लयबद्ध गति में वसंत का आगमन झलकता है; प्रत्येक मुद्रा एक शाश्वत गाथा कहती है।",
                "english": f"The body breathes with the cyclical rhythm of spring; every gesture weaves a timeless visual tapestry."
            }
        elif style == "minimal":
            return {
                "bengali": f"কেন্দ্র মঞ্চে দাঁড়িয়ে হস্তমুদ্রা ও পদ সঞ্চালনা।",
                "hindi": f"मंच के केंद्र में खड़े होकर हस्तमुद्रा और पद संचालन।",
                "english": f"Center stage hand mudra and measured footwork."
            }
        else: # literal
            return {
                "bengali": f"নর্তকী দুই হাত প্রসারিত করে সমপাদ ভঙ্গিমায় পদ সঞ্চালন করছেন।",
                "hindi": f"नर्तकी दोनों हाथों को फैलाकर समपाद मुद्रा में पद संचालन करती है।",
                "english": f"The performer extends both arms outward in an aligned stance, executing synchronized footwork."
            }
