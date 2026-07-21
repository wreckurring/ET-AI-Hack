import logging
from typing import List, Dict, Any
from fastapi import WebSocket

logger = logging.getLogger("raksha.websockets")

class WebSocketConnectionManager:
    """
    Real-Time WebSocket Connection Manager:
    Manages active WebSocket connections for officers and citizens.
    Broadcasts real-time events for report submission, AI classification, and Fast-Freeze state transitions.
    """
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket client connected. Total active connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket client disconnected. Remaining active connections: {len(self.active_connections)}")

    async def broadcast_notification(self, event_type: str, data: Dict[str, Any]):
        """Broadcasts event payload to all connected clients."""
        message = {
            "event_type": event_type,
            "data": data
        }
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.warning(f"Error broadcasting to WebSocket connection: {e}")

# Global Connection Manager instance
ws_manager = WebSocketConnectionManager()
