from .server import sio


# Pen Drawing Events
@sio.event
async def draw_line(sid, data):
    room = data.get("room")

    await sio.emit(
        "draw_line",
        data,
        room=room,
        skip_sid=sid,
    )


@sio.event
async def update_line(sid, data):
    room = data.get("room")

    await sio.emit(
        "update_line",
        data,
        room=room,
        skip_sid=sid,
    )


@sio.event
async def delete_line(sid, data):
    room = data.get("room")

    await sio.emit("delete_line", data, room=room, skip_sid=sid)


# Draw Straight line


@sio.event
async def draw_straight_line(sid, data):
    room = data.get("room")

    await sio.emit(
        "draw_straight_line",
        data,
        room=room,
        skip_sid=sid,
    )


@sio.event
async def update_straight_line(sid, data):
    room = data.get("room")

    await sio.emit("update_straight_line", data, room=room, skip_sid=sid)


# Draw Rectangle


@sio.event
async def draw_rectangle(sid, data):
    room = data.get("room")

    await sio.emit("draw_rectangle", data, room=room, skip_sid=sid)


@sio.event
async def update_rectangle(sid, data):
    room = data.get("room")

    await sio.emit("update_rectangle", data, room=room, skip_sid=sid)

@sio.event
async def delete_rectangle(sid, data):
    room = data.get("room")

    await sio.emit("delete_rectangle", data, room=room, skip_sid=sid)


# Draw Triangle


@sio.event
async def draw_triangle(sid, data):
    room = data.get("room")

    await sio.emit("draw_triangle", data, room=room, skip_sid=sid)


@sio.event
async def update_triangle(sid, data):
    room = data.get("room")

    await sio.emit("update_triangle", data, room=room, skip_sid=sid)


@sio.event
async def delete_triangle(sid, data):
    room = data.get("room")

    await sio.emit("delete_triangle", data, room=room, skip_sid=sid)


# Draw Circle

@sio.event
async def draw_circle(sid, data):
    room = data.get("room")

    await sio.emit("draw_circle", data, room=room, skip_sid=sid)


@sio.event
async def update_circle(sid, data):
    room = data.get("room")

    await sio.emit("update_circle", data, room=room, skip_sid=sid)


@sio.event
async def delete_circle(sid, data):
    room = data.get("room")

    await sio.emit("delete_circle", data, room=room, skip_sid=sid)


# Draw Arrow Line


@sio.event
async def draw_arrow_line(sid, data):
    room = data.get("room")

    await sio.emit("draw_arrow_line", data, room=room, skip_sid=sid)


@sio.event
async def update_arrow_line(sid, data):
    room = data.get("room")

    await sio.emit("update_arrow_line", data, room=room, skip_sid=sid)


@sio.event
async def delete_arrow_line(sid, data):
    room = data.get("room")

    await sio.emit("delete_arrow_line", data, room=room, skip_sid=sid)


# Add Image

@sio.event
async def add_image(sid, data):
    room = data.get("room")

    await sio.emit("add_image", data, room=room, skip_sid=sid)


@sio.event
async def delete_image(sid, data):
    room = data.get("room")

    await sio.emit("delete_image", data, room=room, skip_sid=sid)


# Add Text

@sio.event
async def add_text(sid, data):
    room = data.get("room")

    await sio.emit("add_text", data, room=room, skip_sid=sid)


@sio.event
async def delete_text(sid, data):
    room = data.get("room")

    await sio.emit("delete_text", data, room=room, skip_sid=sid)

# Other


@sio.event
async def drawing_complete(sid, data):
    room = data.get("room")
    userId = data.get("userId")

    await sio.emit("drawing_complete", {"userId": userId}, room=room, skip_sid=sid)
