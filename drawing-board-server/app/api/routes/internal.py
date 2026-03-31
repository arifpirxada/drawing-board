import os
from fastapi import APIRouter, HTTPException, status, Depends, Header
from app.domain.files.services import FileService
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.db import get_db

router = APIRouter(
    prefix="/api/internal",
    tags=["internal"]
)

@router.delete("/image/{image_name}")
async def delete_uploaded_file(
    image_name: str,
    x_internal_secret: str = Header(...),
    session: AsyncSession = Depends(get_db)
):
    file_service = FileService(session)

    try:
        if x_internal_secret != os.getenv("INTERNAL_SECRET"):
            raise HTTPException(status_code=403, detail="Forbidden")
        
        await file_service.delete_uploaded_file(image_name)

        return {
            "success": True,
            "message": "Image deleted successfully",
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"File upload error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="File upload unsuccessful",
        )