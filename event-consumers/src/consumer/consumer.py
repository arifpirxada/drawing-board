import os
import logging
import asyncio
import json
from confluent_kafka import Consumer
from dotenv import load_dotenv
from collections import defaultdict

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
    
    async def process_message(self, msg):
        data = json.loads(msg.value().decode("utf-8"))
        
        logger.info("Message received: ")
        logger.info(json.dumps(data, indent=2))

        self.consumer.commit(asynchronous=False)
    
    async def process_messages(self, file_id, messages):
        pass

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
                    continue
                elif msg.error():
                    raise Exception(f"Kafka error: {msg.error()}")
                else:
                    value = msg.value()
                    if value is None:
                        continue

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
            self.process_messages(file_id, messages)
            for file_id, messages in buffer.items()
        ]
        await asyncio.gather(*tasks)

    def stop(self):
        self.running = False