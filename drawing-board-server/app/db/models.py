# This file import all models for alembic

from app.db.db import Base

from app.domain.users.models import User
from app.domain.files.models import File

__all__ = ["Base", "User", "File"]