from .models import File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from .schemas import CreateFileInput, CreateFileOutput
from sqlalchemy import select
from sqlalchemy import desc


class FileRepository:

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def read_files(self, user_id: str, skip: int, limit: int):
        try:
            stmt = (
                select(File)
                .where(File.owner == user_id)
                .order_by(desc(File.created_at))
                .offset(skip)
                .limit(limit)
            )
            result = await self.session.execute(stmt)

            return result.scalars().all()
        except SQLAlchemyError as e:
            await self.session.rollback()
            raise Exception(f"Database error during reading files: {str(e)}")

    async def create_file(self, file_data: CreateFileInput, user_id: str):
        try:
            new_file = File(
                name=file_data.name,
                data=file_data.data,
                owner=user_id,
                access=file_data.access,
                collaborators=file_data.collaborators,
            )

            self.session.add(new_file)
            await self.session.commit()
            await self.session.refresh(new_file)

            file_dict = {
                "id": str(new_file.id),
                "name": new_file.name,
                "data": new_file.data,
                "owner": str(new_file.owner),
                "access": new_file.access,
                "collaborators": (
                    [str(uuid) for uuid in new_file.collaborators]
                    if new_file.collaborators is not None
                    else []
                ),
            }

            file = CreateFileOutput.model_validate(file_dict)

            return file
        except SQLAlchemyError as e:
            await self.session.rollback()
            raise Exception(f"Database error during file creation: {str(e)}")

    async def update_file(self, file_id: str, file_data, owner_id: str):
        try:
            stmt = select(File).where(File.id == file_id, File.owner == owner_id)
            result = await self.session.execute(stmt)
            file_obj = result.scalar_one_or_none()

            if not file_obj:
                raise Exception("File not found")

            update_data = file_data.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(file_obj, key, value)

            await self.session.commit()
            await self.session.refresh(file_obj)

            return file_obj
        except SQLAlchemyError as e:
            await self.session.rollback()
            raise Exception(f"Database error during updation file:{str(e)}")

    async def delete_file(self, file_id: str, owner_id: str):
        try:
            stmt = select(File).where(File.id == file_id, File.owner == owner_id)
            result = await self.session.execute(stmt)
            file_obj = result.scalar_one_or_none()

            if not file_obj:
                return False

            await self.session.delete(file_obj)

            await self.session.commit()

            return True

        except SQLAlchemyError as e:
            await self.session.rollback()
            raise Exception(f"Database error during deleting file:{str(e)}")
