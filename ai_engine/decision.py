# decision.py

def decide_action(user_type, emotion, time_on_page=0):
    """
    Decide UI behavior based on user type + emotion

    Input:
        user_type (str)
        emotion (str)
        time_on_page (int)

    Output:
        dict - UI decisions
    """

    # Popup trigger logic
    show_popup = time_on_page > 20

    # LOVE - highest priority (conversion mode)
    if emotion == "love":
        return {
            "content_type": "offer",
            "cta": "You’ll love this",
            "show_popup": True,
            "priority": "high_conversion"
        }

    # Confused - guide user
    if emotion == "confused":
        return {
            "content_type": "guided",
            "cta": "Let us help you",
            "show_popup": True,
            "priority": "assist"
        }

    # Bored - make it engaging
    if emotion == "bored":
        return {
            "content_type": "interactive",
            "cta": "Let’s make this fun",
            "show_popup": False,
            "priority": "engage"
        }

    # Low attention
    if user_type == "low_attention":
        return {
            "content_type": "short",
            "cta": "Quick results",
            "show_popup": show_popup,
            "priority": "retain"
        }

    # Engaged user
    if user_type == "engaged_user":
        return {
            "content_type": "detailed",
            "cta": "Explore more",
            "show_popup": show_popup,
            "priority": "inform"
        }

    # Returning user
    if user_type == "returning_user":
        return {
            "content_type": "offer",
            "cta": "Welcome back!",
            "show_popup": show_popup,
            "priority": "convert"
        }

    # Default
    return {
        "content_type": "normal",
        "cta": "Get started",
        "show_popup": show_popup,
        "priority": "default"
    }


# Local testing
if __name__ == "__main__":

    test_cases = [
        ("low_attention", "neutral", 10),
        ("engaged_user", "neutral", 40),
        ("normal_user", "confused", 25),
        ("normal_user", "love", 15),
        ("returning_user", "happy", 10)
    ]

    for user_type, emotion, time in test_cases:
        result = decide_action(user_type, emotion, time)

        print("\nInput:", user_type, emotion, time)
        print("Decision:", result)