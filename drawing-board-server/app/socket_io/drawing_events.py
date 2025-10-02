from .server import sio

@sio.event
async def draw_stroke(sid, data):
    room = data.get('room')
    stroke_data = data.get('stroke')
    await sio.emit('new_stroke', {
        'stroke': stroke_data,
        'user': sid
    }, room=room, skip_sid=sid)

@sio.event
async def clear_canvas(sid, data):
    room = data.get('room')
    await sio.emit('canvas_cleared', {'user': sid}, room=room, skip_sid=sid)
