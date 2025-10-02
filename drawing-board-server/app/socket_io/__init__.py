from .server import sio
from . import chat_events
from . import drawing_events
from . import room_events

@sio.event
async def connect(sid, environ, auth):
    print(f"Client {sid} connected")

@sio.event
async def disconnect(sid):
    print(f"Client {sid} disconnected")
