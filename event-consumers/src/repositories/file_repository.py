import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
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
            logger.error(f"Error while reading single file: {e}")
            raise

    async def read_files_by_id(self, file_ids: list):
        try:
            stmt = select(File).where(File.id.in_(file_ids))
            result = await self.session.execute(stmt)

            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error while reading files by Id: {e}")
            raise

    async def update_file_data(self, file_obj: File, file_data):
        try:
            file_obj.data = file_data
            await self.session.commit()
            await self.session.refresh(file_obj)
            return file_obj

        except Exception as e:
            logger.error(f"Error while updating file data: {e}")
            raise
