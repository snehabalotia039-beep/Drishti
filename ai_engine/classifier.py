# classifier.py

def classify_user(data):
    """
    Classify user based on behavior.
    
    Input:
        data (dict): {
            scroll_speed: "fast"/"slow",
            time_on_page: int (seconds),
            clicks: int,
            is_returning: bool,
            emotion: str (optional)
        }

    Output:
        (user_type, emotion)
    """

    # Safe extraction (avoid crashes)
    scroll_speed = str(data.get("scroll_speed", "slow")).lower()
    time_on_page = data.get("time_on_page", 0)
    clicks = data.get("clicks", 0)
    is_returning = data.get("is_returning", False)
    emotion = str(data.get("emotion", "neutral")).lower()

    # Priority 1: Returning user
    if is_returning:
        return "returning_user", emotion

    # Low attention user
    if scroll_speed == "fast" and time_on_page < 15:
        return "low_attention", emotion

    # Engaged user
    if time_on_page > 30 and clicks >= 2:
        return "engaged_user", emotion

    # Default
    return "normal_user", emotion


def engagement_score(data):
    """
    Simple engagement score (for demo + analytics)
    """
    time_on_page = data.get("time_on_page", 0)
    clicks = data.get("clicks", 0)

    return time_on_page + (clicks * 5)


# Local testing
if __name__ == "__main__":

    sample_users = [
        {
            "scroll_speed": "fast",
            "time_on_page": 8,
            "clicks": 0,
            "is_returning": False,
            "emotion": "neutral"
        },
        {
            "scroll_speed": "slow",
            "time_on_page": 40,
            "clicks": 3,
            "is_returning": False,
            "emotion": "happy"
        },
        {
            "scroll_speed": "slow",
            "time_on_page": 20,
            "clicks": 1,
            "is_returning": True,
            "emotion": "love"
        }
    ]

    for user in sample_users:
        user_type, emotion = classify_user(user)
        score = engagement_score(user)

        print("\nInput:", user)
        print("User Type:", user_type)
        print("Emotion:", emotion)
        print("Engagement Score:", score)