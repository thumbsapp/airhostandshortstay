// js/realtime/websocket-client.js
// WebSocket client for real-time updates

window.AHSS = window.AHSS || {};
window.AHSS.realtime = window.AHSS.realtime || {};

(function() {
    let ws = null;
    const WS_URL = 'wss://api.airhostandshortstay.com/ws'; // placeholder

    function connect() {
        if (ws && ws.readyState === WebSocket.OPEN) return;
        try {
            ws = new WebSocket(WS_URL);
            ws.onopen = () => {
                console.log('WebSocket connected');
                // Subscribe to relevant channels
                subscribe('listings');
                subscribe('incentives');
            };
            ws.onmessage = (event) => {
                window.AHSS.realtime.core.handleMessage(event.data);
            };
            ws.onclose = () => {
                console.log('WebSocket disconnected, retrying...');
                setTimeout(connect, 5000);
            };
            ws.onerror = (err) => console.error('WebSocket error', err);
        } catch (e) {
            console.error('WebSocket connection failed', e);
        }
    }

    function disconnect() {
        if (ws) ws.close();
    }

    function subscribe(channel) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'subscribe', channel }));
        }
    }

    function unsubscribe(channel) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'unsubscribe', channel }));
        }
    }

    function send(message) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }

    window.AHSS.realtime.websocket = {
        connect,
        disconnect,
        subscribe,
        unsubscribe,
        send
    };
})();