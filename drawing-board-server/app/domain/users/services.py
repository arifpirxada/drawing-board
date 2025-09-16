import os
from dotenv import load_dotenv

import jwt
from passlib.context import CryptContext
from .repository import UserRepository
from .schemas import RegisterUserInput, RegisterUserOutput
from datetime import datetime, timedelta, timezone

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")


class UserService:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.userRepo = UserRepository()

    # Utils

    ## Password Utils

    def verify_password(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return self.pwd_context.hash(password)
    

    ## Registration Utils

    def get_user_by_email(self, email: str):
        return self.userRepo.get_user_by_email(email)
    
    def create_access_token(self, data: dict, expires_delta: timedelta | None = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    

    # Services

    def register_user(self, userData: RegisterUserInput):
        userData.password = self.get_password_hash(userData.password)
        user: RegisterUserOutput = self.userRepo.create_user(userData)

        return user

    def authenticate_user(self):
        pass