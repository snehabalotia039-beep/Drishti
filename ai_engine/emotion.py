# emotion.py

from deepface import DeepFace
import cv2
import numpy as np
import base64
import io
from PIL import Image
from collections import Counter


# Map raw emotions to system emotions
def map_emotion(e):

    e = str(e).lower()

    if e in ["happy", "surprise"]:
        return "love"

    elif e in ["sad", "fear"]:
        return "confused"

    elif e in ["neutral", "angry"]:
        return "bored"

    return "neutral"


# Detect emotion from IMAGE
def detect_from_image(image_path):

    try:
        result = DeepFace.analyze(
            img_path=image_path,
            actions=['emotion'],
            enforce_detection=False
        )

        emotion = result[0]['dominant_emotion']
        return map_emotion(emotion)

    except Exception as e:
        print("Image Error:", e)
        return "neutral"


# Detect emotion from BASE64 frame (from browser webcam)
def detect_from_base64(image_b64):
    """
    Takes a base64-encoded image string (from browser's canvas.toDataURL()),
    decodes it, runs DeepFace emotion detection, and returns the mapped emotion.
    
    This is the primary method for live webcam emotion detection in production —
    the browser captures the frame and sends it to this function via API.
    """
    try:
        # Strip data URL prefix if present (e.g., "data:image/jpeg;base64,")
        if "," in image_b64:
            image_b64 = image_b64.split(",", 1)[1]

        # Decode base64 → bytes → PIL Image → numpy array
        image_bytes = base64.b64decode(image_b64)
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        frame = np.array(pil_image)

        # Convert RGB to BGR for DeepFace/OpenCV
        frame_bgr = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        # Resize for faster processing
        frame_bgr = cv2.resize(frame_bgr, (224, 224))

        result = DeepFace.analyze(
            frame_bgr,
            actions=['emotion'],
            enforce_detection=False
        )

        raw_emotion = result[0]['dominant_emotion']
        all_emotions = result[0].get('emotion', {})

        mapped = map_emotion(raw_emotion)

        print(f"[emotion] Detected: {raw_emotion} -> {mapped}")
        print(f"   Scores: {all_emotions}")

        return {
            "mapped_emotion": mapped,
            "raw_emotion": raw_emotion,
            "scores": all_emotions
        }

    except Exception as e:
        print("Base64 Emotion Error:", e)
        return {
            "mapped_emotion": "neutral",
            "raw_emotion": "unknown",
            "scores": {}
        }


# Detect emotion from VIDEO
def detect_from_video(video_path, frame_skip=10, max_frames=100):

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("Error: Cannot open video")
        return "neutral"

    emotions = []
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count > max_frames:
            break

        if frame_count % frame_skip == 0:
            try:
                frame = cv2.resize(frame, (224, 224))

                result = DeepFace.analyze(
                    frame,
                    actions=['emotion'],
                    enforce_detection=False
                )

                emotion = result[0]['dominant_emotion']
                emotions.append(emotion)

                print(f"Frame {frame_count}: {emotion}")

            except:
                pass

        frame_count += 1

    cap.release()

    if not emotions:
        return "neutral"

    final = Counter(emotions).most_common(1)[0][0]
    return map_emotion(final)


# Detect emotion from WEBCAM (5-10 sec capture)
def detect_from_webcam(duration=5, frame_skip=5):

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Cannot access webcam")
        return "neutral"

    emotions = []
    frame_count = 0

    # Get FPS
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    if fps == 0:
        fps = 10  # fallback

    max_frames = duration * fps

    print("[webcam] Capturing webcam for emotion detection...")

    while frame_count < max_frames:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_skip == 0:
            try:
                frame = cv2.resize(frame, (224, 224))

                result = DeepFace.analyze(
                    frame,
                    actions=['emotion'],
                    enforce_detection=False
                )

                emotion = result[0]['dominant_emotion']
                emotions.append(emotion)

                print(f"Frame {frame_count}: {emotion}")

            except:
                pass

        frame_count += 1

    cap.release()

    if not emotions:
        return "neutral"

    final = Counter(emotions).most_common(1)[0][0]

    print("Final Emotion:", final)

    return map_emotion(final)


# Testing
if __name__ == "__main__":

    print("Testing emotion detection...")

    # Test image
    # print("Image:", detect_from_image("test.jpg"))

    # Test video
    # print("Video:", detect_from_video("test.mp4"))

    # Test webcam (5 sec)
    print("Webcam Emotion:", detect_from_webcam(duration=5))