import os
import logging
import asyncio
import json
from confluent_kafka import Consumer
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("event-consumers")

# Get Kafka broker urls

KAFKA_URL = os.getenv("KAFKA_URL")
KAFKA_URL_2 = os.getenv("KAFKA_URL_2")

if KAFKA_URL is None:
    logger.error("KAFKA_URL not provided")
    raise

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
            "enable.auto.commit": False
        }
        self.running = True
        self.consumer = Consumer(self.conf)
        self.topics = topics
        self.group = group
    
    async def process_message(self, msg):
        data = json.loads(msg.value().decode("utf-8"))
        
        logger.info("Message received: ")
        logger.info(json.dumps(data, indent=2))

    async def run(self):
        self.consumer.subscribe(topics=self.topics)

        logger.info(f"Consumer subscribed: {",".join(bootstrap_servers)}; Group: {self.group}")

        try:
            while self.running:
                msg = await asyncio.to_thread(self.consumer.poll, 1.0)

                if msg is None:
                    continue
                elif msg.error():
                    raise Exception(f"Kafka error: {msg.error()}")
                else:
                    await self.process_message(msg)
        except Exception as e:
            logger.error(f"Error consuming messages: {e}")
            raise
        finally:
            self.consumer.close()
            logger.info("🛑 Consumer connection closed.")

    def stop(self):
        self.running = False