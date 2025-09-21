from typing import Any, Dict, Optional, List
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum


class AccessLevel(str, Enum):
    public = "public"
    private = "private"


class CreateFileInput(BaseModel):
    name: str
    data: Dict[str, Any]
    access: Optional[AccessLevel] = Field(default=AccessLevel.private)
    collaborators: Optional[List[str]] = Field(default_factory=list)


class CreateFileOutput(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    data: Dict[str, Any]
    owner: str
    access: Optional[AccessLevel] = Field(default=AccessLevel.private)
    collaborators: Optional[List[str]] = Field(default_factory=list)


class UpdateFileInput(BaseModel):
    name: Optional[str] = Field(default=None)
    data: Optional[Dict[str, Any]] = Field(default=None)
    access: Optional[AccessLevel] = Field(default=None)
    collaborators: Optional[List[str]] = Field(default=None)
