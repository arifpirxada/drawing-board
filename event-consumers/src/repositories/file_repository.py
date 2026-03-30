import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from src.db.models import File

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("file_repository")

class FileRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def read_single_file(self, file_id: str):
        try:
            stmt = select(File).where(File.id == file_id)
            result = await self.session.execute(stmt)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error reading file {file_id}: {e}")
            raise

    async def read_files_by_id(self, file_ids: list):
        try:
            stmt = select(File).where(File.id.in_(file_ids))
            result = await self.session.execute(stmt)
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error reading files: {e}")
            raise

    async def update_file_data(self, file_obj: File, file_data):
        try:
            stmt = (
                update(File)
                .where(File.id == file_obj.id)
                .values(data=file_data)
            )
            await self.session.execute(stmt)
            await self.session.commit()
            return file_obj
        except Exception as e:
            logger.error(f"Error updating file {file_obj.id}: {e}")
            await self.session.rollback()
            raise
