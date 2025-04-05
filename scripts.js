document.addEventListener("DOMContentLoaded", () => {
  // Initialize Feather icons
  feather.replace()

  // DOM elements
  const chatForm = document.getElementById("chat-form")
  const messageInput = document.getElementById("message-input")
  const chatMessages = document.getElementById("chat-messages")
  const sendButton = document.getElementById("send-button")
  const refreshButton = document.getElementById("refresh-button")

  // Remove empty state on first message
  function removeEmptyState() {
    const emptyState = document.querySelector(".empty-state")
    if (emptyState) {
      emptyState.remove()
    }
  }

  // Add a message to the chat
  function addMessage(content, isUser = false) {
    removeEmptyState()

    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${isUser ? "user-message" : "ai-message"}`

    const messageBubble = document.createElement("div")
    messageBubble.className = "message-bubble"
    messageBubble.textContent = content

    messageDiv.appendChild(messageBubble)
    chatMessages.appendChild(messageDiv)

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Mock AI response
  function mockAiResponse(userMessage) {
    // Simple responses based on user input
    const responses = [
      "I'm Serenity, how can I help you today?",
      "That's an interesting question. Let me think about it.",
      "I understand what you're asking. Here's what I think...",
      "Thanks for sharing that with me.",
      "I'm here to assist you with any questions you might have.",
    ]

    // Simulate typing delay
    setTimeout(() => {
      // Choose a random response
      const randomIndex = Math.floor(Math.random() * responses.length)
      addMessage(responses[randomIndex], false)
    }, 1000)
  }

  // Handle form submission
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const message = messageInput.value.trim()
    if (!message) return

    // Add user message
    addMessage(message, true)

    // Clear input
    messageInput.value = ""

    // Get AI response
    mockAiResponse(message)
  })

  // Enable/disable send button based on input
  messageInput.addEventListener("input", () => {
    sendButton.disabled = !messageInput.value.trim()
  })

  // Initialize send button state
  sendButton.disabled = true

  // Handle refresh button
  refreshButton.addEventListener("click", () => {
    // Clear chat messages and restore empty state
    chatMessages.innerHTML = '<div class="empty-state"><p>Start a conversation with Serenity...</p></div>'

    // Clear input
    messageInput.value = ""
    sendButton.disabled = true
  })
})

