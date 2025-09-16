from pydantic import BaseModel

class UserResponse (BaseModel):
    id: str
    name: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class RegisterUserInput(BaseModel):
    name: str
    email: str
    password: str

class RegisterUserOutput(BaseModel):
    id: str
    name: str
    email: str