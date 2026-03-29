import os
import json
import asyncio
import logging
from confluent_kafka import Producer
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("kafka-producer")

KAFKA_URL = os.getenv("KAFKA_URL", "kafka:9092")
KAFKA_URL_2 = os.getenv("KAFKA_URL_2")

kafka_urls = [KAFKA_URL]

if KAFKA_URL_2 is not None:
    kafka_urls.append(KAFKA_URL_2)


class KafkaProducer:
    def __init__(self):
        self.conf = {
            "bootstrap.servers": ",".join(kafka_urls),
            "client.id": "fastapi-producer",
            "linger.ms": 5,
            "compression.type": "snappy",
        }
        self.producer = Producer(self.conf)

    def _delivery_report(self, err, msg):
        if err is not None:
            logger.error(f"Message delivery failed: {err}")
        else:
            logger.info(f"Message delivered to {msg.topic()} [{msg.partition()}]")

    async def send_message(self, topic: str, value: dict, key: str | bytes | None = None):
        try:
            payload = json.dumps(value).encode("utf-8")

            key = self.serialize_key(key)

            self.producer.produce(topic, key=key, value=payload, callback=self._delivery_report)

            self.producer.poll(0)

        except Exception as e:
            logger.error(f"Error producing to Kafka: {e}")

    def flush(self):
        self.producer.flush()

    def serialize_key(self, key):
        if key is None:
            return None
        if isinstance(key, str):
            return key.encode("utf-8")
        return key


kafka_producer = KafkaProducer()
