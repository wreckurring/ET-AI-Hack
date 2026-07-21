from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.websocket_manager import ws_manager

router = APIRouter(tags=["Real-Time Notifications & WebSockets"])

@router.websocket("/ws/notifications")
async def websocket_notifications_endpoint(websocket: WebSocket):
    """
    Real-Time WebSocket Endpoint:
    Broadcasts live notification events when a report is submitted, AI analysis completes, or Fast-Freeze state transitions occur.
    """
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and listen for client messages
            data = await websocket.receive_text()
            await websocket.send_json({"status": "PONG", "received": data})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
