// Required modules
const fs = require("fs");
const { Groq } = require("groq");

const MEMORY_FILE = "memories.txt";

// Initialize Groq client
const client = new Groq({
  apiKey: "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",
});

// Load old memories
let oldMemories = "";
try {
  if (fs.existsSync(MEMORY_FILE)) {
    oldMemories = fs.readFileSync(MEMORY_FILE, "utf-8").trim();
  }
} catch (error) {
  console.error("Error reading memory file:", error);
}

// Initial system prompt with emotional support behavior
let messages = [
  {
    role: "system",
    content:
      "Be a compassionate listener and emotional support. Acknowledge my feelings, ask thoughtful questions to help me reflect, and offer occasional advice only when helpful. Keep the tone casual and responses short like a real conversation. Check in on how I'm feeling every now and then, and offer breathing exercises if the conversation dies down or I have nothing to say.",
  },
];

// Add old memories to the conversation if any
if (oldMemories) {
  messages.push({
    role: "system",
    content: `This is what you discussed with the user last time:\n${oldMemories}`,
  });
}

console.log("Start chatting. Type 'quit' to end the conversation.\n");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Initial mood
let mood = "Neutral";

// Main chat loop
function chat() {
  readline.question("You: ", async (userInput) => {
    if (userInput.toLowerCase().trim() === "quit") {
      // Summarize the conversation and memories
      const summaryPrompt = [
        ...messages,
        {
          role: "user",
          content:
            "Can you summarize everything we talked about today in a way that could be saved as a memory in the perspective of the user?",
        },
      ];

      try {
        const summaryCompletion = await client.chat.completions.create({
          messages: summaryPrompt,
          model: "llama-3.3-70b-versatile",
        });

        const summary = summaryCompletion.choices[0].message.content.trim();

        // Save to memories.txt
        fs.writeFileSync(MEMORY_FILE, summary);
        console.log("\nConversation ended. Memories saved.");
      } catch (error) {
        console.error("Error during summary:", error);
      }

      readline.close();
      return;
    }

    messages.push({ role: "user", content: userInput });

    // Get chatbot response
    client.chat.completions
      .create({
        messages: messages,
        model: "llama-3.3-70b-versatile",
      })
      .then((chatCompletion) => {
        const reply = chatCompletion.choices[0].message.content;
        console.log("Bot:", reply);
        messages.push({ role: "assistant", content: reply });

        // Mood estimation
        const moodCheckPrompt = [
          {
            role: "system",
            content:
              "Based on the user's most recent message and the assistant's reply, estimate the user's general emotional mood in one word (e.g., Happy, Sad, Anxious, Angry, Calm, Neutral). Only return the word.",
          },
          { role: "user", content: `User: ${userInput}\nAssistant: ${reply}` },
        ];

        return client.chat.completions.create({
          messages: moodCheckPrompt,
          model: "llama-3.3-70b-versatile",
        });
      })
      .then((moodCompletion) => {
        mood = moodCompletion.choices[0].message.content.trim();
        console.log(`[Mood: ${mood}]`); // For testing

        // Continue the conversation
        chat();
      })
      .catch((error) => {
        console.error("Error during chat:", error);
        chat();
      });
  });
}

// Start the chat
chat();
