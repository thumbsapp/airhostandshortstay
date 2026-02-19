// js/ui/assistant.js
// Dash AI Assistant – floating bot with contextual help and quick actions

window.AHSS = window.AHSS || {};
window.AHSS.ui = window.AHSS.ui || {};

(function() {
    let assistantButton = null;
    let chatPanel = null;
    let isOpen = false;

    function init() {
        createAssistantButton();
        attachEvents();
    }

    function createAssistantButton() {
        if (document.querySelector('.dash-assistant')) return;
        assistantButton = document.createElement('div');
        assistantButton.className = 'dash-assistant floating pulse-glow';
        assistantButton.innerHTML = '🤖';
        document.body.appendChild(assistantButton);
    }

    function createChatPanel() {
        if (chatPanel) return;
        chatPanel = document.createElement('div');
        chatPanel.className = 'assistant-chat-panel';
        chatPanel.innerHTML = `
            <div class="chat-header">
                <span>Dash AI Assistant</span>
                <button class="close-chat">&times;</button>
            </div>
            <div class="chat-messages">
                <div class="message bot">Hi! I'm Dash. How can I help you today?</div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="assistant-input" placeholder="Ask me anything...">
                <button id="send-assistant">Send</button>
            </div>
        `;
        document.body.appendChild(chatPanel);

        chatPanel.querySelector('.close-chat').addEventListener('click', togglePanel);
        chatPanel.querySelector('#send-assistant').addEventListener('click', sendMessage);
        chatPanel.querySelector('#assistant-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function togglePanel() {
        if (!chatPanel) createChatPanel();
        isOpen = !isOpen;
        chatPanel.classList.toggle('open', isOpen);
        if (isOpen) {
            chatPanel.querySelector('#assistant-input').focus();
        }
    }

    function sendMessage() {
        const input = chatPanel.querySelector('#assistant-input');
        const text = input.value.trim();
        if (!text) return;
        addMessage(text, 'user');
        input.value = '';

        // Simulate bot response
        setTimeout(() => {
            let response = generateResponse(text);
            addMessage(response, 'bot');
        }, 500);
    }

    function addMessage(text, sender) {
        const messages = chatPanel.querySelector('.chat-messages');
        const msg = document.createElement('div');
        msg.className = `message ${sender}`;
        msg.textContent = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function generateResponse(query) {
        const lower = query.toLowerCase();
        if (lower.includes('discount') || lower.includes('incentive')) {
            return "You can find properties with high incentive scores. Use the 'Incentive' filter to see top rewards.";
        } else if (lower.includes('lipa') || lower.includes('installment')) {
            return "Lipa Mdogo allows you to pay in 4 interest‑free installments. Look for the 💰 button on property pages.";
        } else if (lower.includes('negotiat')) {
            return "You can send an offer to the host using the 'Negotiate' button on the property page.";
        } else if (lower.includes('wishlist')) {
            return "Click the ❤️ icon on any listing to add it to your wishlist.";
        } else {
            return "I'm here to help! You can ask about discounts, payment plans, or how to compare properties.";
        }
    }

    function attachEvents() {
        if (assistantButton) {
            assistantButton.addEventListener('click', togglePanel);
        }
    }

    window.AHSS.ui.assistant = {
        init,
        toggle: togglePanel,
        sendMessage
    };

    // Auto-init
    document.addEventListener('DOMContentLoaded', init);
})();