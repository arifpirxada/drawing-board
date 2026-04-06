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

# Shape Drawing Events
@sio.event
async def draw_shape(sid, data):
    room = data.get("room")

    await sio.emit(
        "draw_shape",
        data,
        room=room,
        skip_sid=sid,
    )

    data["event_type"] = "draw_shape"
    await safe_kafka_send("drawing_events", data)

@sio.event
async def update_shape(sid, data):
    room = data.get("room")

    await sio.emit(
        "update_shape",
        data,
        room=room,
        skip_sid=sid,
    )
    
    data["event_type"] = "update_shape"
    await safe_kafka_send("drawing_events", data)

@sio.event
async def delete_shapes(sid, data):
    room = data.get("room")

    await sio.emit("delete_shapes", data, room=room, skip_sid=sid)

    data["event_type"] = "delete_shapes"
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
