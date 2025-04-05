document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chat-messages")
  const chatInput = document.getElementById("chat-input")
  const sendButton = document.getElementById("send-button")

  // Sample bot responses
  const botResponses = [
    "I notice something's not working right on my end. How are you feeling right now? I'm here to listen.",
    "Thank you for sharing that with me. Could you tell me more about how these experiences have been affecting you emotionally?",
    "I understand that can be difficult. What kind of support would be most helpful for you right now?",
    "It sounds like you're going through a challenging time. Remember that it's okay to feel this way, and your feelings are valid.",
    "I'm here to support you. Would it help to talk about some coping strategies that might work for your situation?",
  ]

  // Add initial bot message
  addMessage("I'm here to listen and support you. How are you feeling today?", "bot")

  // Send message when button is clicked
  sendButton.addEventListener("click", sendMessage)

  // Send message when Enter key is pressed
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })

  function sendMessage() {
    const message = chatInput.value.trim()
    if (message !== "") {
      // Add user message to chat
      addMessage(message, "user")

      // Clear input field
      chatInput.value = ""

      // Simulate bot thinking with delay
      setTimeout(() => {
        // Always respond with "hi"
        addMessage("hi", "bot")

        // Scroll to bottom of chat
        chatMessages.scrollTop = chatMessages.scrollHeight
      }, 1000)
    }
  }

  function addMessage(text, sender) {
    const messageElement = document.createElement("div")
    messageElement.classList.add("message")
    messageElement.classList.add(sender === "user" ? "user-message" : "bot-message")
    messageElement.textContent = text

    chatMessages.appendChild(messageElement)

    // Scroll to bottom of chat
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
})

