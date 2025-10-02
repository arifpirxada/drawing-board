import os
from dotenv import load_dotenv

import jwt
from passlib.context import CryptContext
from .repository import UserRepository
from .schemas import RegisterUserInput, RegisterUserOutput, LoginUserOut, ReadUserMeOut
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
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

class UserService:
    def __init__(self, session: AsyncSession):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
        self.userRepo = UserRepository(session)

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

    async def register_user(self, userData: RegisterUserInput):
        userData.password = self.get_password_hash(userData.password)
        user: RegisterUserOutput = await self.userRepo.create_user(userData)

        return user

    async def login(self, email: str, password: str):
        user = await self.userRepo.get_user_by_email(email)

        if not user:
            return False
        
        if not self.verify_password(password, user.password):
            return False
        
        user_data = LoginUserOut(
            id=str(user.id),
            name=str(user.name),
            email=str(user.email)
        )
        
        return user_data
    
    async def get_current_user(self, token: str):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            id = payload.get("id")
            if id is None:
                raise credentials_exception
        except InvalidTokenError:
            raise credentials_exception
        user = await self.userRepo.get_user_by_id(id)
        if user is None:
            raise credentials_exception
        
        user_data = ReadUserMeOut(
            id=str(user.id),
            name=str(user.name),
            email=str(user.email)
        )

        return user_data
    

    async def search_users(self, q: str):
        result = await self.userRepo.search_users(q)
        return result