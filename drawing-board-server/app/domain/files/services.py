import os
from dotenv import load_dotenv

from fastapi import HTTPException, status
from .repository import FileRepository
from .schemas import CreateFileInput, UpdateFileInput
import jwt
from jwt.exceptions import InvalidTokenError

from sqlalchemy.ext.asyncio import AsyncSession

load_dotenv()

_secret_key = os.getenv("JWT_SECRET_KEY")
_algorithm = os.getenv("JWT_ALGORITHM")

if _secret_key is None:
    raise ValueError("JWT_SECRET_KEY environment variable is not set.")
SECRET_KEY: str = _secret_key

if _algorithm is None:
    raise ValueError("JWT_ALGORITHM environment variable is not set.")
ALGORITHM: str = _algorithm 


class FileService:

    def __init__(self, session: AsyncSession):
        self.fileRepo = FileRepository(session)

    # Utils

    async def get_current_user_id(self, token: str):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("id")
            if user_id is None:
                raise credentials_exception
            
            return user_id
        except InvalidTokenError:
            raise credentials_exception
        

    # Services

    async def read_files(self, token: str, skip: int, limit: int):
        user_id = await self.get_current_user_id(token)

        files = await self.fileRepo.read_files(user_id, skip, limit)

        return files
    
    async def read_single_file(self, file_id: str):
        file = await self.fileRepo.read_single_file(file_id)

        return file
    

    async def create_file(self, file_data: CreateFileInput, token: str):
        user_id = await self.get_current_user_id(token)

        file = await self.fileRepo.create_file(file_data, user_id)

        return file
    

    async def update_file(self, file_id: str, file_data: UpdateFileInput, token: str):
        user_id = await self.get_current_user_id(token)

        if not user_id:
            raise Exception("File update error: User not authenticated")
            
        file = await self.fileRepo.update_file(file_id, file_data, user_id)

        return file
    

    async def delete_file(self, file_id: str, token: str):
        user_id = await self.get_current_user_id(token)

        if not user_id:
            raise Exception("File delete error: User not authenticated")
            
        deleted = await self.fileRepo.delete_file(file_id, user_id)

        return deleted
    