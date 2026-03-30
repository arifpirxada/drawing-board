import asyncio
import signal
from .consumer.consumer import KafkaConsumer
from .db.db import check_connection

async def main():
    await check_connection()

    consumer = KafkaConsumer(topics=["drawing_events"])

    task = asyncio.create_task(consumer.run())

    try:
        await task
    except asyncio.CancelledError:
        print("Main cancelled")
    finally:
        consumer.stop()

if __name__ == "__main__":
    asyncio.run(main())