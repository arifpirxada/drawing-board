import os
import logging
from sqlalchemy.ext.asyncio import create_async_engine , async_sessionmaker, AsyncSession
from sqlalchemy import text
from dotenv import load_dotenv
from sqlalchemy.orm import declarative_base

load_dotenv()

logger = logging.getLogger("event-consumers")

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    raise Exception("Database URL Not provided")

engine = create_async_engine(DATABASE_URL)

async_session = async_sessionmaker(bind=engine, expire_on_commit=False)

Base = declarative_base()

async def get_db():
    async with async_session() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def check_connection():
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            logger.info("✅ Database connection successful")
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")