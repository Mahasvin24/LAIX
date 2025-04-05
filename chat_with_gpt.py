import os
from groq import Groq

MEMORY_FILE = "memories.txt"

# Load old memories
if os.path.exists(MEMORY_FILE):
    with open(MEMORY_FILE, "r") as f:
        old_memories = f.read().strip()
else:
    old_memories = ""

client = Groq(api_key="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")

# Initial system prompt with emotional support behavior
messages = [
    {
        "role": "system",
        "content": "Be a compassionate listener and emotional support. Acknowledge my feelings, ask thoughtful questions to help me reflect, and offer occasional advice only when helpful. Keep the tone casual and responses short like a real conversation. Check in on how I’m feeling every now and then, and offer breathing exercises if the conversation dies down or I have nothing to say.",
    }
]

# Add old memories to the conversation if any
if old_memories:
    messages.append({
        "role": "system",
        "content": f"This is what you discussed with the user last time:\n{old_memories}"
    })

print("Start chatting. Type 'quit' to end the conversation.\n")

mood = "Neutral"  # Initial mood

while True:
    user_input = input("You: ")
    if user_input.lower().strip() == "quit":
        break

    messages.append({"role": "user", "content": user_input})

    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama-3.3-70b-versatile",
    )

    reply = chat_completion.choices[0].message.content
    print("Bot:", reply)
    messages.append({"role": "assistant", "content": reply})

    # Mood estimation
    mood_check_prompt = [
        {
            "role": "system",
            "content": "Based on the user's most recent message and the assistant's reply, estimate the user's general emotional mood in one word (e.g., Happy, Sad, Anxious, Angry, Calm, Neutral). Only return the word.",
        },
        {"role": "user", "content": f"User: {user_input}\nAssistant: {reply}"}
    ]

    mood_completion = client.chat.completions.create(
        messages=mood_check_prompt,
        model="llama-3.3-70b-versatile",
    )

    mood = mood_completion.choices[0].message.content.strip()
    print(f"[Mood: {mood}]")  # For testing

# Summarize the conversation and memories
summary_prompt = messages + [
    {
        "role": "user",
        "content": "Can you summarize everything we talked about today in a way that could be saved as a memory in the perspective of the user?",
    }
]

summary_completion = client.chat.completions.create(
    messages=summary_prompt,
    model="llama-3.3-70b-versatile",
)

summary = summary_completion.choices[0].message.content.strip()

# Save to memories.txt
with open(MEMORY_FILE, "w") as f:
    f.write(summary)

print("\nConversation ended. Memories saved.")
