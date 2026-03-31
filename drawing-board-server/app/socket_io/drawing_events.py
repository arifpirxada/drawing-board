from .server import sio
from app.kafka_producer.producer import kafka_producer


async def safe_kafka_send(topic, data):
    try:
        room = data.get("room")
        key = str(room) if room is not None else None

        await kafka_producer.send_message(topic, data, key)

        print(f"Sent to {topic} | key={key} | data=")

    except Exception as e:
        print(f"Kafka error: {e}")
        raise

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

    data["event_type"] = "draw_line"
    await safe_kafka_send("drawing_events", data)



@sio.event
async def update_line(sid, data):
    room = data.get("room")

    await sio.emit(
        "update_line",
        data,
        room=room,
        skip_sid=sid,
    )
    
    data["event_type"] = "update_line"
    await safe_kafka_send("drawing_events", data)



@sio.event
async def delete_line(sid, data):
    room = data.get("room")

    await sio.emit("delete_line", data, room=room, skip_sid=sid)

    data["event_type"] = "delete_line"
    await safe_kafka_send("drawing_events", data)


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

    data["event_type"] = "draw_straight_line"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def update_straight_line(sid, data):
    room = data.get("room")

    await sio.emit("update_straight_line", data, room=room, skip_sid=sid)

    data["event_type"] = "update_straight_line"
    await safe_kafka_send("drawing_events", data)


# Draw Rectangle


@sio.event
async def draw_rectangle(sid, data):
    room = data.get("room")

    await sio.emit("draw_rectangle", data, room=room, skip_sid=sid)

    data["event_type"] = "draw_rectangle"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def update_rectangle(sid, data):
    room = data.get("room")

    await sio.emit("update_rectangle", data, room=room, skip_sid=sid)

    data["event_type"] = "update_rectangle"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def delete_rectangle(sid, data):
    room = data.get("room")

    await sio.emit("delete_rectangle", data, room=room, skip_sid=sid)

    data["event_type"] = "delete_rectangle"
    await safe_kafka_send("drawing_events", data)


# Draw Triangle


@sio.event
async def draw_triangle(sid, data):
    room = data.get("room")

    await sio.emit("draw_triangle", data, room=room, skip_sid=sid)

    data["event_type"] = "draw_triangle"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def update_triangle(sid, data):
    room = data.get("room")

    await sio.emit("update_triangle", data, room=room, skip_sid=sid)

    data["event_type"] = "update_triangle"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def delete_triangle(sid, data):
    room = data.get("room")

    await sio.emit("delete_triangle", data, room=room, skip_sid=sid)

    data["event_type"] = "delete_triangle"
    await safe_kafka_send("drawing_events", data)


# Draw Circle


@sio.event
async def draw_circle(sid, data):
    room = data.get("room")

    await sio.emit("draw_circle", data, room=room, skip_sid=sid)

    data["event_type"] = "draw_circle"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def update_circle(sid, data):
    room = data.get("room")

    await sio.emit("update_circle", data, room=room, skip_sid=sid)

    data["event_type"] = "update_circle"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def delete_circle(sid, data):
    room = data.get("room")

    await sio.emit("delete_circle", data, room=room, skip_sid=sid)

    data["event_type"] = "delete_circle"
    await safe_kafka_send("drawing_events", data)


# Draw Arrow Line


@sio.event
async def draw_arrow_line(sid, data):
    room = data.get("room")

    await sio.emit("draw_arrow_line", data, room=room, skip_sid=sid)

    data["event_type"] = "draw_arrow_line"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def update_arrow_line(sid, data):
    room = data.get("room")

    await sio.emit("update_arrow_line", data, room=room, skip_sid=sid)

    data["event_type"] = "update_arrow_line"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def delete_arrow_line(sid, data):
    room = data.get("room")

    await sio.emit("delete_arrow_line", data, room=room, skip_sid=sid)

    data["event_type"] = "delete_arrow_line"
    await safe_kafka_send("drawing_events", data)


# Add Image


@sio.event
async def add_image(sid, data):
    room = data.get("room")

    await sio.emit("add_image", data, room=room, skip_sid=sid)

    data["event_type"] = "add_image"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def delete_image(sid, data):
    room = data.get("room")

    await sio.emit("delete_image", data, room=room, skip_sid=sid)

    data["event_type"] = "delete_image"
    await safe_kafka_send("drawing_events", data)


# Add Text


@sio.event
async def add_text(sid, data):
    room = data.get("room")

    await sio.emit("add_text", data, room=room, skip_sid=sid)

    data["event_type"] = "add_text"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def delete_text(sid, data):
    room = data.get("room")

    await sio.emit("delete_text", data, room=room, skip_sid=sid)

    data["event_type"] = "delete_text"
    await safe_kafka_send("drawing_events", data)


# Other


@sio.event
async def drawing_complete(sid, data):
    room = data.get("room")
    userId = data.get("userId")

    await sio.emit("drawing_complete", {"userId": userId}, room=room, skip_sid=sid)

    data["event_type"] = "drawing_complete"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def transform_shape(sid, data):
    room = data.get("room")

    await sio.emit("transform_shape", data, room=room, skip_sid=sid)

    data["event_type"] = "transform_shape"
    await safe_kafka_send("drawing_events", data)


@sio.event
async def drag_shape(sid, data):
    room = data.get("room")

    await sio.emit("drag_shape", data, room=room, skip_sid=sid)

@sio.event
async def drag_shape_end(sid, data):
    data["event_type"] = "drag_shape_end"
    await safe_kafka_send("drawing_events", data)
