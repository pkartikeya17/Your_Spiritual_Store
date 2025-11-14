/* ===========================
   AI Chatbot Integration
   =========================== */

class MysticChatbot {
  constructor() {
    this.chatButton = document.getElementById('chatButton');
    this.chatWindow = document.getElementById('chatWindow');
    this.chatMessages = document.getElementById('chatMessages');
    this.chatInput = document.getElementById('chatInput');
    this.chatSend = document.getElementById('chatSend');
    this.chatCloseBtn = document.getElementById('chatCloseBtn');
    
    this.apiKey = this.getApiKey();
    this.conversationHistory = [];
    this.isOpen = false;
    
    this.init();
  }

  getApiKey() {
    // Try to get API key from theme settings
    // In production, this would be set via Shopify admin
    const metaTag = document.querySelector('meta[name="gemini-api-key"]');
    return metaTag ? metaTag.content : '';
  }

  init() {
    // Toggle chat window
    this.chatButton?.addEventListener('click', () => this.toggleChat());
    this.chatCloseBtn?.addEventListener('click', () => this.closeChat());
    
    // Send message on button click
    this.chatSend?.addEventListener('click', () => this.handleSendMessage());
    
    // Send message on Enter key
    this.chatInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    // Load conversation history from sessionStorage
    this.loadConversationHistory();
  }

  toggleChat() {
    this.isOpen ? this.closeChat() : this.openChat();
  }

  openChat() {
    this.isOpen = true;
    this.chatButton?.classList.add('active');
    this.chatWindow?.classList.add('active');
    this.chatInput?.focus();
  }

  closeChat() {
    this.isOpen = false;
    this.chatButton?.classList.remove('active');
    this.chatWindow?.classList.remove('active');
  }

  async handleSendMessage() {
    const message = this.chatInput?.value.trim();
    
    if (!message) return;
    
    // Add user message to UI
    this.addMessage(message, 'user');
    
    // Clear input
    if (this.chatInput) {
      this.chatInput.value = '';
    }
    
    // Disable send button
    if (this.chatSend) {
      this.chatSend.disabled = true;
    }
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Get bot response
    try {
      const response = await this.getBotResponse(message);
      this.removeTypingIndicator();
      this.addMessage(response, 'bot');
    } catch (error) {
      console.error('Chatbot error:', error);
      this.removeTypingIndicator();
      this.addMessage('I apologize, but I\'m having trouble connecting right now. Please try again in a moment.', 'bot');
    }
    
    // Re-enable send button
    if (this.chatSend) {
      this.chatSend.disabled = false;
    }
    
    // Save conversation
    this.saveConversationHistory();
  }

  addMessage(text, sender) {
    if (!this.chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' 
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
    
    // Store in conversation history
    this.conversationHistory.push({ role: sender, content: text });
  }

  showTypingIndicator() {
    if (!this.chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      </div>
      <div class="message-content">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    
    this.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    indicator?.remove();
  }

  async getBotResponse(userMessage) {
    // If API key is available, use Gemini API
    if (this.apiKey) {
      return await this.getGeminiResponse(userMessage);
    } else {
      // Fallback to mock responses
      return this.getMockResponse(userMessage);
    }
  }

  async getGeminiResponse(userMessage) {
    const systemPrompt = `You are a helpful spiritual advisor assistant for MysticAura, an online store specializing in crystals, spiritual artifacts, and sacred items. 

Your role:
- Help customers find the right spiritual products
- Provide information about crystal properties and benefits
- Answer questions about product availability and features
- Offer guidance on spiritual practices (respectfully)
- Be warm, knowledgeable, and professional

Available products include:
1. 7 Horses on Raw Pyrite Frame - A powerful Vastu remedy for prosperity and success
2. Dhan Yog Bracelet - A bracelet designed to attract wealth and abundance

Keep responses concise (2-3 sentences) and helpful.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getMockResponse(userMessage);
    }
  }

  getMockResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Product-specific responses
    if (lowerMessage.includes('horse') || lowerMessage.includes('pyrite')) {
      return "The 7 Horses on Raw Pyrite Frame is one of our most popular items! It's a powerful Vastu remedy believed to bring success and remove obstacles. The natural pyrite adds grounding energy. Would you like to know more about its placement or benefits?";
    }
    
    if (lowerMessage.includes('bracelet') || lowerMessage.includes('dhan yog')) {
      return "Our Dhan Yog Bracelet is specially designed to attract wealth and abundance. It combines powerful gemstones known for their prosperity-enhancing properties. It's comfortable for daily wear and comes in adjustable sizing. Interested in learning about the specific stones used?";
    }
    
    // General inquiries
    if (lowerMessage.includes('shipping') || lowerMessage.includes('deliver')) {
      return "We offer free shipping on orders over ₹999 and typically deliver within 5-7 business days across India. Express shipping is also available. Would you like to place an order?";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Our products are competitively priced with excellent quality. The 7 Horses Frame and Dhan Yog Bracelet are both available in our shop. Would you like me to help you find the current prices?";
    }
    
    if (lowerMessage.includes('crystal') || lowerMessage.includes('stone')) {
      return "We specialize in authentic crystals and spiritual stones! Each piece is carefully selected for its energy and quality. Are you looking for something specific, or would you like recommendations based on your intentions?";
    }
    
    // Default responses
    const defaultResponses = [
      "I'd be happy to help you find the perfect spiritual item! We have beautiful crystals, sacred artifacts, and prosperity items. What interests you most?",
      "Thank you for reaching out! I can help you learn more about our products or answer any questions about crystals and spiritual items. What would you like to know?",
      "Welcome! Whether you're new to spiritual practices or an experienced collector, I'm here to guide you. How can I assist you today?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  scrollToBottom() {
    if (this.chatMessages) {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  saveConversationHistory() {
    try {
      sessionStorage.setItem('chatHistory', JSON.stringify(this.conversationHistory));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  loadConversationHistory() {
    try {
      const saved = sessionStorage.getItem('chatHistory');
      if (saved) {
        this.conversationHistory = JSON.parse(saved);
        
        // Restore messages to UI (skip the initial welcome message)
        this.conversationHistory.forEach((msg, index) => {
          if (index > 0) { // Skip first message as it's already in HTML
            this.addMessageToUI(msg.content, msg.role);
          }
        });
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  }

  addMessageToUI(text, sender) {
    if (!this.chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' 
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    this.chatMessages.appendChild(messageDiv);
  }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.mysticChatbot = new MysticChatbot();
  });
} else {
  window.mysticChatbot = new MysticChatbot();
}