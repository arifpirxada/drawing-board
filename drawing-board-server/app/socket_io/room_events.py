from .server import sio
from .state import room_users

@sio.event
async def join_room(sid, data):

    room = data.get("room")
    user_id = data.get("userId")
    user_email = data.get("userEmail")

    room_users[room][sid] = {
        "userId": user_id,
        "userEmail": user_email,
    }

    await sio.enter_room(sid, room)

    # Notify others in the room
    await sio.emit(
        "user_joined",
        {"room": room, "userId": user_id, "userEmail": user_email},
        room=room,
        skip_sid=sid,
    )

    # Send current user list to the newly joined client
    current_users = list(room_users[room].values())

    await sio.emit(
        "current_users",
        {"room": room, "users": current_users},
        to=sid,
    )
