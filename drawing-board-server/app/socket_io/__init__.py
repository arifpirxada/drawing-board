from .server import sio
from . import chat_events
from . import drawing_events
from . import room_events

from .state import room_users

@sio.event
async def connect(sid, environ, auth):
    print(f"Client {sid} connected")

@sio.event
async def disconnect(sid):
    print(f"Client {sid} disconnected")

    for room, users in room_users.items():
        if sid in users:
            user_info = users.pop(sid)

            # Notify others in the room
            await sio.emit(
                "user_left",
                {"room": room, "userId": user_info["userId"], "userEmail": user_info["userEmail"]},
                room=room,
            )

            # Leave the room
            await sio.leave_room(sid, room)

            # delete room entry if empty
            if not users:
                del room_users[room]

            break
