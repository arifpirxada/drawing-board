import os
from dotenv import load_dotenv

from fastapi import HTTPException, status, File, UploadFile, Request
from .repository import FileRepository
from .schemas import CreateFileInput, UpdateFileInput
import jwt
from jwt.exceptions import InvalidTokenError

from sqlalchemy.ext.asyncio import AsyncSession
from pathlib import Path
import shutil
import uuid

load_dotenv()

_secret_key = os.getenv("JWT_SECRET_KEY")
_algorithm = os.getenv("JWT_ALGORITHM")

if _secret_key is None:
    raise ValueError("JWT_SECRET_KEY environment variable is not set.")
SECRET_KEY: str = _secret_key

if _algorithm is None:
    raise ValueError("JWT_ALGORITHM environment variable is not set.")
ALGORITHM: str = _algorithm


# File upload variables

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


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


    async def upload_file(self, file: UploadFile, file_id: str, request: Request | None = None):

        if not file.filename:
            raise HTTPException(status_code=400, detail="No file selected or filename is missing")

        # Validate file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}",
            )

        # Validate file size (e.g., 10MB limit)
        MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
        if file.size and file.size > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large")

        # Generate secure filename
        secure_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / secure_filename

        try:
            # Save file to disk
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            if request:
                base_url = str(request.base_url).rstrip('/')
                file_url = f"{base_url}/uploads/{secure_filename}"
            else:
                # Fallback if no request object
                file_url = f"/uploads/{secure_filename}"

            return {
                "secure_filename": secure_filename,
                "url": file_url,
            }

        except Exception as e:
            if file_path.exists():
                file_path.unlink()
            raise HTTPException(
                status_code=500, detail=f"Failed to save file: {str(e)}"
            )
        
    async def delete_uploaded_file(self, image_name: str):
        try:
            file_path = Path("uploads") / image_name

            file_path.unlink(missing_ok=True)

        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to delete uploaded file: {str(e)}"
            )
