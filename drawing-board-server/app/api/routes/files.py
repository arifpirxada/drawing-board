from fastapi import APIRouter, HTTPException, status, Depends
from app.domain.files.schemas import CreateFileInput, UpdateFileInput
from app.domain.files.services import FileService
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.db import get_db


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter(
    prefix="/api/files",
    tags=["files"],
)


@router.get("/")
async def read_files(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 10,
):
    file_service = FileService(session)

    try:
        files = await file_service.read_files(token, skip, limit)

        return {
            "success": True,
            "message": "Files read successfully",
            "data": files,
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Read files error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not read files",
        )


@router.post("/")
async def create_file(
    file_data: CreateFileInput,
    token: Annotated[str, Depends(oauth2_scheme)],
    session: AsyncSession = Depends(get_db),
):
    file_service = FileService(session)

    try:
        file = await file_service.create_file(file_data, token)

        return {
            "success": True,
            "message": "File created successfully",
            "file": file,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"File creation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="File creation unsuccessful",
        )


@router.patch("/{file_id}")
async def update_file(
    file_id: str,
    file_data: UpdateFileInput,
    token: Annotated[str, Depends(oauth2_scheme)],
    session: AsyncSession = Depends(get_db),
):
    file_service = FileService(session)

    try:
        file = await file_service.update_file(file_id, file_data, token)

        if not file:
            raise Exception("Could not update file")

        return {
            "success": True,
            "message": "File updated successfully",
            "file": file,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"File updation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="File updation unsuccessful",
        )


@router.delete("/{file_id}")
async def delete_file(
    file_id: str,
    token: Annotated[str, Depends(oauth2_scheme)],
    session: AsyncSession = Depends(get_db),
):
    file_service = FileService(session)

    try:
        deleted = await file_service.delete_file(file_id, token)

        if not deleted:
            raise HTTPException(status_code=404, detail="File not found or unauthorized")

        return {
            "success": True,
            "message": "File deleted successfully",
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"File deletion error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="File deletion unsuccessful",
        )
