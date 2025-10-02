from pydantic import BaseModel
from uuid import UUID

class UserResponse (BaseModel):
    id: str
    name: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: str | None = None

class RegisterUserInput(BaseModel):
    name: str
    email: str
    password: str

class RegisterUserOutput(BaseModel):
    id: str
    name: str
    email: str

class LoginInput(BaseModel):
    email: str
    password: str

class LoginUserOut(BaseModel):
    id: str
    email: str
    name: str

class ReadUserMeOut(BaseModel):
    id: str
    email: str
    name: str

class UserOut(BaseModel):
    id: UUID
    email: str
    name: str

    class Config:
        from_attributes = True

class SearchUsersOut(BaseModel):
    data: list[UserOut]


class GetUsersByIdArrInput(BaseModel):
    data: list[str]

class GetUsersByIdArrOut(BaseModel):
    data: list[UserOut]