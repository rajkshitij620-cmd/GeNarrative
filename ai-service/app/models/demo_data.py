"""
RASA CUE - Benchmark Demonstration Dataset
Specifically calibrated for 60-second Bengali Classical & Folk Fusion Dance
"Rituranga: Season of Joy"
"""

BENCHMARK_DEMO_TIMELINE = {
    "captions": [
        {
            "id": "cap_ai_1",
            "startTime": 2.0,
            "endTime": 8.5,
            "speaker": "Narrator / Singer",
            "text": {
                "bengali": "আকাশে বাতাসে নবীন সুর, ঋতুর রঙে মেতেছে ধরণী।",
                "hindi": "आकाश और हवाओं में नया राग गूंज रहा है, धरती रंगों में लीन है।",
                "english": "A new melody resonates in the winds; the earth awakens in the colors of the season."
            },
            "status": "ai_suggested"
        },
        {
            "id": "cap_ai_2",
            "startTime": 18.0,
            "endTime": 26.0,
            "speaker": "Bol Recitation",
            "text": {
                "bengali": "ধা ধিন ধিন ধা | তা তিন তিন তা | তেটে কতা গদি ঘেনে ধা!",
                "hindi": "धा धिन धिन धा | ता तिन तिन ता | तेटे कता गदि घेने धा!",
                "english": "Dha Dhin Dhin Dha | Ta Tin Tin Ta | Tete Kata Gadi Ghene Dha!"
            },
            "status": "ai_suggested"
        },
        {
            "id": "cap_ai_3",
            "startTime": 38.0,
            "endTime": 46.5,
            "speaker": "Chorus",
            "text": {
                "bengali": "ঘূর্ণির তালে ঘুঙুরের বোল বাজে আনন্দধারায়।",
                "hindi": "चक्कर की थाप पर घुंघरुओं का स्वर आनंद की धारा बहाता है।",
                "english": "In the spin of the rhythm, ankle bells echo with joyous radiance."
            },
            "status": "ai_suggested"
        },
        {
            "id": "cap_ai_4",
            "startTime": 52.0,
            "endTime": 59.5,
            "speaker": "Final Salutation",
            "text": {
                "bengali": "প্রণাম জানাই প্রকৃতি ও দর্শকবৃন্দকে। সমাপনী সম।",
                "hindi": "प्रकृति और दर्शकों को सादर प्रणाम। सम पर समर्पण।",
                "english": "Salutations to nature and the audience. Returning in harmony to the Sam."
            },
            "status": "ai_suggested"
        }
    ],
    "movementEvents": [
        {
            "id": "mov_ai_1",
            "timestamp": 3.5,
            "duration": 4.0,
            "poseName": "Aramandi Opening Stance",
            "description": "The dancer establishes a centered low stance, gently lifting palms upward in Samputa mudra, symbolizing the opening of blossoms.",
            "bodyRegion": "full_body",
            "style": "poetic",
            "confidence": 0.94,
            "status": "ai_suggested"
        },
        {
            "id": "mov_ai_2",
            "timestamp": 12.0,
            "duration": 3.5,
            "poseName": "Pataka & Mayura Mudra Sequence",
            "description": "The dancer alternates hands between Pataka and Mayura mudras, tracing the graceful flight of birds across an imaginary horizon.",
            "bodyRegion": "mudra",
            "style": "literal",
            "confidence": 0.96,
            "status": "ai_suggested"
        },
        {
            "id": "mov_ai_3",
            "timestamp": 24.0,
            "duration": 5.0,
            "poseName": "Tatkar Footwork Acceleration",
            "description": "Rhythmic, crisp stamping of bare feet striking the stage floor in sync with the accelerating Teental rhythm.",
            "bodyRegion": "footwork",
            "style": "literal",
            "confidence": 0.91,
            "status": "ai_suggested"
        },
        {
            "id": "mov_ai_4",
            "timestamp": 38.0,
            "duration": 4.5,
            "poseName": "Triple Chakkars (Kathak Pirouettes)",
            "description": "Three rapid, seamless 360-degree spins with arms extended horizontally, the flowing costume flaring into a circle of saffron fabric.",
            "bodyRegion": "full_body",
            "style": "poetic",
            "confidence": 0.98,
            "status": "ai_suggested"
        },
        {
            "id": "mov_ai_5",
            "timestamp": 54.0,
            "duration": 5.0,
            "poseName": "Namaskar Stance at Sam",
            "description": "The performer converges to center stage, folding hands at chest level into an Anjali mudra with a serene, humbled expression.",
            "bodyRegion": "torso",
            "style": "minimal",
            "confidence": 0.95,
            "status": "ai_suggested"
        }
    ],
    "sceneEvents": [
        {
            "id": "scn_ai_1",
            "timestamp": 0.5,
            "lightingCue": "Amber backlighting fades up gently",
            "spatialFocus": "center_stage",
            "description": "Warm amber spotlights illuminate the performer in silhouette before revealing intricate gold embroidery on the costume.",
            "status": "ai_suggested"
        },
        {
            "id": "scn_ai_2",
            "timestamp": 22.0,
            "lightingCue": "Side wash switches to vibrant cobalt blue",
            "spatialFocus": "diagonal_right",
            "description": "Dynamic diagonal lighting heightens the dramatic shadow interplay as footwork gains velocity.",
            "status": "ai_suggested"
        },
        {
            "id": "scn_ai_3",
            "timestamp": 50.0,
            "lightingCue": "Golden central spotlight with soft vignette",
            "spatialFocus": "center_stage",
            "description": "Surrounding stage darkens into a focused golden pool of light framing the dancer’s final salutation.",
            "status": "ai_suggested"
        }
    ],
    "soundEvents": [
        {
            "id": "snd_ai_1",
            "timestamp": 1.0,
            "instrumentOrCue": "Tanpura Drone & Bamboo Flute Alaap",
            "intensity": "soft",
            "description": "Atmospheric resonant drone with gentle melodic ornamentation establishing the spring morning mood.",
            "status": "ai_suggested"
        },
        {
            "id": "snd_ai_2",
            "timestamp": 16.5,
            "instrumentOrCue": "Tabla Entry (Teental)",
            "intensity": "moderate",
            "description": "Clear, resonant Bayan and Dayan strokes marking a 16-beat cycle with grounded rhythmic cadence.",
            "status": "ai_suggested"
        },
        {
            "id": "snd_ai_3",
            "timestamp": 35.0,
            "instrumentOrCue": "Accelerating Ghungroo Bells",
            "intensity": "crescendo",
            "description": "Intense rhythmic metallic chimes from hundreds of brass ankle bells building toward the climactic spin.",
            "status": "ai_suggested"
        },
        {
            "id": "snd_ai_4",
            "timestamp": 48.0,
            "instrumentOrCue": "Climactic Tihai Stroke",
            "intensity": "abrupt",
            "description": "Crisp synchronous strike of tabla and footwork resolving on the primary beat (Sam), followed by silence.",
            "status": "ai_suggested"
        }
    ],
    "hapticCues": [
        {
            "id": "hap_ai_1",
            "timestamp": 2.0,
            "durationMs": 150,
            "intensity": 40,
            "pattern": [150],
            "patternType": "subtle",
            "label": "Opening Flute Breath",
            "associatedEventId": "snd_ai_1",
            "status": "ai_suggested"
        },
        {
            "id": "hap_ai_2",
            "timestamp": 16.5,
            "durationMs": 250,
            "intensity": 70,
            "pattern": [200, 80, 120],
            "patternType": "rhythm",
            "label": "Tabla Theka Beat 1 (Sam)",
            "associatedEventId": "snd_ai_2",
            "status": "ai_suggested"
        },
        {
            "id": "hap_ai_3",
            "timestamp": 24.5,
            "durationMs": 400,
            "intensity": 85,
            "pattern": [100, 50, 100, 50, 100],
            "patternType": "heartbeat",
            "label": "Rapid Tatkar Foot Stamping",
            "associatedEventId": "mov_ai_3",
            "status": "ai_suggested"
        },
        {
            "id": "hap_ai_4",
            "timestamp": 38.0,
            "durationMs": 650,
            "intensity": 95,
            "pattern": [120, 40, 140, 40, 180, 40, 250],
            "patternType": "crescendo",
            "label": "Triple Chakkars Whirlwind",
            "associatedEventId": "mov_ai_4",
            "status": "ai_suggested"
        },
        {
            "id": "hap_ai_5",
            "timestamp": 48.0,
            "durationMs": 300,
            "intensity": 100,
            "pattern": [300],
            "patternType": "pulse",
            "label": "Final Tihai Resolution",
            "associatedEventId": "snd_ai_4",
            "status": "ai_suggested"
        }
    ],
    "accessibilityDescriptions": [
        {
            "id": "desc_ai_1",
            "timestamp": 3.0,
            "duration": 5.0,
            "style": "poetic",
            "text": {
                "bengali": "নর্তকী মন্দ্রিত ভঙ্গিমায় দাঁড়িয়ে করপুট উন্মোচন করছেন, যেন বসন্তের প্রথম কুঁড়ি ফুটছে।",
                "hindi": "नर्तकी शांत भाव में अपनी हथेलियों को खोलती है, जैसे वसंत की पहली कली खिल रही हो।",
                "english": "The dancer lowers into a graceful posture, unfolding her palms like the first buds of spring."
            },
            "status": "ai_suggested"
        },
        {
            "id": "desc_ai_2",
            "timestamp": 24.0,
            "duration": 4.5,
            "style": "literal",
            "text": {
                "bengali": "নূপুরের দ্রুত ঝংকারে তবলা ও পদাবলীর নিপুণ সমন্বয় ঘটছে।",
                "hindi": "पैरों के तीव्र थाप पर घुंघरू और तबले का तीव्र सामंजस्य हो रहा है।",
                "english": "Crisp rhythmic footwork creates a rapid unison between ankle bells and percussion."
            },
            "status": "ai_suggested"
        },
        {
            "id": "desc_ai_3",
            "timestamp": 38.0,
            "duration": 5.5,
            "style": "poetic",
            "text": {
                "bengali": "তিনটি অবিরাম ঘূর্ণন; গেরুয়া বসন বাতাসে বৃত্তাকার মেঘের মতো ভেসে উঠছে।",
                "hindi": "तीन तीव्र चक्कर; केसरिया पोशाक हवा में लहराते हुए गोलाकार छटा बिखेरती है।",
                "english": "Three continuous pirouettes whirl seamlessly; the saffron dress billows into a glowing circle."
            },
            "status": "ai_suggested"
        },
        {
            "id": "desc_ai_4",
            "timestamp": 54.0,
            "duration": 4.5,
            "style": "minimal",
            "text": {
                "bengali": "মঞ্চের কেন্দ্রে স্থির হয়ে বিনম্র অঞ্জলি মুদ্রায় প্রণাম।",
                "hindi": "मंच के केंद्र में स्थिर होकर अंजलि मुद्रा में शांत नमस्कार।",
                "english": "Center stage stillness, bowing serenely in Anjali mudra."
            },
            "status": "ai_suggested"
        }
    ]
}
