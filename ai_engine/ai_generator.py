# ai_generator.py

import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

# Initialize LLM (key from .env, NEVER hardcoded)
llm = ChatGroq(
    groq_api_key=os.environ.get("GROQ_API_KEY"),
    model_name="llama-3.1-8b-instant"
)

# Prompt Template (headline + CTA generation)
prompt = ChatPromptTemplate.from_template("""
User type: {user_type}
User emotion: {emotion}
Page: {page}
Section: {section}

Generate:
1. A catchy marketing headline (max 8 words)
2. A CTA (max 4 words)

Instructions:
- Adapt to BOTH behavior and emotion
- If emotion is "love", make it persuasive and conversion-focused
- If confused, make it helpful and reassuring
- If bored, make it engaging and exciting
- Match the page context (product page vs home vs pricing)
- Keep it short and punchy

Return ONLY valid JSON:
{{
    "headline": "...",
    "cta": "..."
}}
""")

# Smart Decision Prompt (LLM reasons about everything)
smart_prompt = ChatPromptTemplate.from_template("""
You are Drishti, an AI marketing optimization engine. Analyze the user's behavior and decide what to do.

## User Data
- Scroll Speed: {scroll_speed}
- Time on Page: {time_on_page} seconds
- Clicks: {clicks}
- Detected Emotion: {emotion}
- Page: {page}
- Section: {section}
- User Type: {user_type}

## Rules to Consider
1. If emotion is "love" or "happy" → high conversion intent, push offers
2. If emotion is "confused" → guide them, simplify messaging
3. If emotion is "bored" → make it exciting, add urgency
4. If scroll speed is "fast" and time < 15s → user is about to leave, act fast
5. If time > 30s → user is interested, offer a deal
6. If clicks >= 3 → engaged user, show deeper content
7. If clicks < 2 and time > 15s → hesitant user, provide reassurance

## Your Task
Based on ALL the data above, decide:
1. headline: A catchy marketing headline (max 8 words)
2. cta: A CTA button text (max 4 words)  
3. content_type: One of "offer", "guided", "interactive", "short", "detailed", "normal"
4. priority: One of "high_conversion", "assist", "engage", "retain", "inform", "convert", "default"
5. show_popup: true or false
6. reasoning: A brief explanation of WHY you made this decision (1 sentence)

Return ONLY valid JSON:
{{
    "headline": "...",
    "cta": "...",
    "content_type": "...",
    "priority": "...",
    "show_popup": false,
    "reasoning": "..."
}}
""")

# Cache
cache = {}


# Fallback
def fallback_text(user_type, emotion):

    if emotion == "love":
        return {
            "headline": "This is made for you",
            "cta": "Grab now"
        }

    if emotion == "confused":
        return {
            "headline": "Let us guide you step by step",
            "cta": "Start now"
        }

    if emotion == "bored":
        return {
            "headline": "Let's make this interesting",
            "cta": "Try it"
        }

    if user_type == "low_attention":
        return {
            "headline": "No time? Start instantly",
            "cta": "Try now"
        }

    if user_type == "engaged_user":
        return {
            "headline": "Dive deeper into smarter solutions",
            "cta": "Explore"
        }

    if user_type == "returning_user":
        return {
            "headline": "Welcome back!",
            "cta": "Continue"
        }

    return {
        "headline": "Discover something amazing",
        "cta": "Get started"
    }


# Smart fallback (includes full decision fields)
def fallback_smart(user_type, emotion):
    base = fallback_text(user_type, emotion)
    return {
        **base,
        "content_type": "normal",
        "priority": "default",
        "show_popup": False,
        "reasoning": "Fallback: AI unavailable, using rule-based defaults"
    }


# AI Call (basic: headline + CTA)
def call_ai(user_type, emotion, page="home", section="hero"):

    chain = prompt | llm

    response = chain.invoke({
        "user_type": user_type,
        "emotion": emotion,
        "page": page,
        "section": section
    })

    text = response.content.strip()

    # Clean markdown if exists
    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(text)
    except:
        return fallback_text(user_type, emotion)


# Smart AI Call (full decision with reasoning)
def call_smart_ai(user_type, emotion, scroll_speed, time_on_page, clicks, page="home", section="hero"):

    chain = smart_prompt | llm

    response = chain.invoke({
        "user_type": user_type,
        "emotion": emotion,
        "scroll_speed": scroll_speed,
        "time_on_page": time_on_page,
        "clicks": clicks,
        "page": page,
        "section": section
    })

    text = response.content.strip()

    # Clean markdown if exists
    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(text)
        # Validate required fields
        required = ["headline", "cta", "content_type", "priority", "show_popup"]
        if all(k in result for k in required):
            return result
        else:
            return fallback_smart(user_type, emotion)
    except:
        return fallback_smart(user_type, emotion)


# Main function (basic)
def generate_text(user_type, emotion, page="home", section="hero"):

    key = f"{user_type}_{emotion}_{page}_{section}"

    # cache
    if key in cache:
        return cache[key]

    try:
        result = call_ai(user_type, emotion, page, section)
        cache[key] = result
        return result

    except Exception as e:
        print("AI Error:", e)
        return fallback_text(user_type, emotion)


# Smart Decision function (LLM-powered full decision)
def generate_smart_decision(user_type, emotion, scroll_speed, time_on_page, clicks, page="home", section="hero"):

    key = f"smart_{user_type}_{emotion}_{scroll_speed}_{time_on_page}_{clicks}_{page}_{section}"

    # cache
    if key in cache:
        return cache[key]

    try:
        result = call_smart_ai(
            user_type, emotion, scroll_speed,
            time_on_page, clicks, page, section
        )
        cache[key] = result
        return result

    except Exception as e:
        print("Smart AI Error:", e)
        return fallback_smart(user_type, emotion)


# Test
if __name__ == "__main__":

    test_cases = [
        ("low_attention", "neutral"),
        ("engaged_user", "neutral"),
        ("normal_user", "confused"),
        ("normal_user", "love"),
        ("returning_user", "happy")
    ]

    for user_type, emotion in test_cases:
        print(f"\nInput: {user_type}, {emotion}")
        print(generate_text(user_type, emotion))