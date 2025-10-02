from .server import sio

@sio.event
async def send_message(sid, data):
    message = data.get('message')
    room = data.get('room')
    await sio.emit('new_message', {
        'message': message,
        'sender': sid
    }, room=room)

@sio.event
async def typing(sid, data):
    room = data.get('room')
    await sio.emit('user_typing', {'user': sid}, room=room, skip_sid=sid)
