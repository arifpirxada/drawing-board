import os
import logging
import asyncio
import json
import math
from confluent_kafka import Consumer
from dotenv import load_dotenv
from collections import defaultdict
from src.repositories.file_repository import FileRepository
from src.db.db import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from src.db.db import async_session

load_dotenv()

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("event-consumers")

# Get Kafka broker urls

KAFKA_URL = os.getenv("KAFKA_URL")
KAFKA_URL_2 = os.getenv("KAFKA_URL_2")

if KAFKA_URL is None:
    logger.error("KAFKA_URL not provided")
    raise ValueError("KAFKA_URL not provided")

bootstrap_servers = [KAFKA_URL]

if KAFKA_URL_2 is None:
    logger.warning("KAFKA_URL_2 not provided")
else:
    bootstrap_servers.append(KAFKA_URL_2)


class KafkaConsumer:
    def __init__(self, topics, group = "event-consumers"):
        self.conf = {
            "bootstrap.servers" : ",".join(bootstrap_servers),
            "group.id": group,
            "enable.auto.commit": False,
            "auto.offset.reset": "earliest",
        }
        self.running = True
        self.consumer = Consumer(self.conf)
        self.topics = topics
        self.group = group


    @asynccontextmanager
    async def get_repo(self):
        async with async_session() as session:
            yield FileRepository(session)

    
    def process_message(self, msg, file_data):
        try:
            data = msg
            
            logger.info(f"Processing message: {data["event_type"]}")
            # logger.info(json.dumps(data, indent=2))

            match data["event_type"]:
                case "draw_line":
                    if "lines" not in file_data:
                        file_data["lines"] = []

                    file_data["lines"].append(data)

                case "update_line":
                    if "lines" not in file_data: 
                        return

                    for line in file_data["lines"]:
                        if line["id"] == data["id"]:
                            line["points"].append(data["points"]["x"])
                            line["points"].append(data["points"]["y"])

                case "delete_line":
                    if "lines" not in file_data: 
                        return

                    file_data["lines"] = [line for line in file_data["lines"] if line["id"] != data["id"]]

                case "draw_straight_line":
                    if "lines" not in file_data:
                        file_data["lines"] = []

                    file_data["lines"].append(data)

                case "update_straight_line":
                    if "lines" not in file_data:
                        return
                    
                    for line in file_data["lines"]:
                        if line["id"] == data["id"]:
                            line["points"] = [line["points"][0], line["points"][1], data["points"]["x"], data["points"]["y"]]

                case "draw_rectangle":
                    if "rectangles" not in file_data:
                        file_data["rectangles"] = []

                    file_data["rectangles"].append(data)

                case "update_rectangle":
                    if "rectangles" not in file_data:
                        return
                    
                    for rectangle in file_data["rectangles"]:
                        if rectangle.id == data.id:
                            rectangle["width"] = data["points"]["x"] - rectangle["x"]
                            rectangle["height"] = data["points"]["y"] - rectangle["y"]

                case "delete_rectangle":
                    if "rectangles" not in file_data:
                        return
                    
                    file_data["rectangles"] = [rect for rect in file_data["rectangles"] if rect["id"] != data["id"]]

                case "draw_triangle":
                    if "triangles" not in file_data:
                        file_data["triangles"] = []

                    file_data["triangle"].append(data)

                case "update_triangle":
                    if "triangles" not in file_data:
                        return
                    
                    for triangle in file_data["triangles"]:
                        if triangle.id == data.id:
                            startX = triangle["points"][0]
                            startY = triangle["points"][1]

                            x = data["points"]["x"] - startX
                            y = data["points"]["y"] - startY

                            triangle["points"][3] = triangle["points"][1] + y
                            triangle["points"][4] = triangle["points"][0] + x
                            triangle["points"][5] = triangle["points"][1] + y
                    
                case "delete_triangle":
                    if "triangles" not in file_data:
                        return
                    
                    file_data["triangles"] = [tri for tri in file_data["triangles"] if tri["id"] != data["id"]]

                case "draw_circle":
                    if "circles" not in file_data:
                        file_data["circles"] = []

                    file_data["circles"].append(data)

                case "update_circle":
                    if "circles" not in file_data:
                        return
                    
                    for circle in file_data["circles"]:
                        if circle["id"] == data["id"]:
                            dx = data["points"]["x"] - circle["x"]
                            dy = data["points"]["y"] - circle["y"]

                            new_radius = math.sqrt(dx * dx + dy * dy)

                            circle["radius"] = new_radius
                    
                case "delete_circle":
                    if "circles" not in file_data:
                        return
                    
                    file_data["circles"] = [cir for cir in file_data["circles"] if cir["id"] != data["id"]]

                case "draw_arrow_line":
                    if "arrowLines" not in file_data:
                        file_data["arrowLines"] = []

                    file_data["arrowLines"].append(data)

                case "update_arrow_line":
                    if "arrowLines" not in file_data:
                        return
                    
                    for arrLine in file_data["arrowLines"]:
                        if arrLine["id"] == data["id"]:
                            arrLine["points"] = [arrLine["points"][0], arrLine["points"][1], data["points"]["x"], data["points"]["y"]]
 
                case "delete_arrow_line":
                    if "arrowLines" not in file_data:
                        return
                    
                    file_data["arrowLines"] = [arrLine for arrLine in file_data["arrowLines"] if arrLine["id"] != data["id"]]

                case "add_image":
                    pass
                case "delete_image":
                    pass
                case "add_text":
                    pass
                case "delete_text":
                    pass
                case "drawing_complete":
                    pass
                case "transform_shape":
                    pass
                case "drag_shape":
                    pass
                case _:
                    pass
        except Exception as e:
            logger.error(f"Error while processing message {e}")
            raise

        

        
    
    async def process_file_messages(self, file_id, messages):
        logger.info("Processing messages in bulk: ")
        try:
            async with self.get_repo() as file_repo:
                file = await file_repo.read_single_file(file_id)

                if file is None:
                    logger.warning("File not found while processing file messages")
                    return

                # lines
                # arrowLines
                # rectangles
                # triangles
                # circles

                file_data = file.data

                for msg in messages:
                    self.process_message(msg, file_data)

                await file_repo.update_file_data(file, file_data)

                logger.info("Modified file: ")
                logger.info(json.dumps(file_data, indent=2))

                self.consumer.commit(asynchronous=False)


        except Exception as e:
            logger.error(f"Error while processing file messages {e}")
            raise

    async def run(self):
        self.consumer.subscribe(topics=self.topics)

        logger.info(f"Consumer subscribed: {",".join(self.topics)}; Group: {self.group}")

        buffer: dict[str, list] = defaultdict(list)
        last_flush = asyncio.get_event_loop().time()
        FLUSH_INTERVAL = 5.0

        try:
            while self.running:
                msg = await asyncio.to_thread(self.consumer.poll, 1.0)

                if msg is None:
                    pass
                elif msg.error():
                    raise Exception(f"Kafka error: {msg.error()}")
                else:
                    value = msg.value()
                    if value is not None:
                        payload = json.loads(value.decode("utf-8"))
                        file_id = payload["room"]
                        buffer[file_id].append(payload)
                
                now = asyncio.get_event_loop().time()
                if now - last_flush >= FLUSH_INTERVAL and buffer:
                    await self.flush(buffer)
                    buffer.clear()
                    last_flush = now

        except Exception as e:
            logger.exception(f"Error consuming messages: {e}")
            raise
        finally:
            if buffer:
                await self.flush(buffer)
            self.consumer.close()
            logger.info("🛑 Consumer connection closed.")

    async def flush(self, buffer: dict[str, list]):
        tasks = [
            self.process_file_messages(file_id, messages)
            for file_id, messages in buffer.items()
        ]
        await asyncio.gather(*tasks)

    def stop(self):
        self.running = False