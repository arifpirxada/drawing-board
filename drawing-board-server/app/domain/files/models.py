import uuid
from sqlalchemy import Column, String, JSON, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from app.db.db import Base
import enum

class AccessLevel(enum.Enum):
    public = "public"
    private = "private"

class File(Base):
    __tablename__ = "files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    data = Column(JSON)
    owner = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    user = relationship('User', back_populates='files')

    access = Column(Enum(AccessLevel), default=AccessLevel.private)
    collaborators = Column(ARRAY(UUID(as_uuid=True)), default=list)