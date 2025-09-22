from fastapi import APIRouter, Depends, HTTPException, status
from app.domain.users.schemas import (
    RegisterUserInput,
    RegisterUserOutput,
    LoginInput,
    LoginUserOut,
    ReadUserMeOut
)
from app.domain.users.services import UserService
from datetime import timedelta
from typing import Literal, Annotated
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.ext.asyncio import AsyncSession
from app.db.db import get_db


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 Days

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
)

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register_user(userData: RegisterUserInput, session: AsyncSession = Depends(get_db)):
    userService = UserService(session)

    try:
        # Check if user already exists
        existing_user = await userService.get_user_by_email(userData.email)

        if existing_user:
            print("user exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )

        user: RegisterUserOutput = await userService.register_user(userData)

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = userService.create_access_token(
            data={"id": user.id}, expires_delta=access_token_expires
        )
        return {
            "success": True,
            "message": "Registration successfull",
            "user": user,
            "access_token": access_token,
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration unsuccessful",
        )


@router.post("/login")
async def login(form_data: LoginInput, session: AsyncSession = Depends(get_db)):
    userService = UserService(session)

    try:

        user: LoginUserOut | Literal[False] = await userService.login(
            form_data.email, form_data.password
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = userService.create_access_token(
            data={"id": user.id}, expires_delta=access_token_expires
        )

        return {
            "success": True,
            "message": "Login successfull",
            "user": user,
            "access_token": access_token,
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login unsuccessful",
        )


@router.get("/me", response_model=ReadUserMeOut)
async def read_user_me(token: Annotated[str, Depends(oauth2_scheme)], session: AsyncSession = Depends(get_db)):
    userService = UserService(session)

    try:
        user: ReadUserMeOut = await userService.get_current_user(token)
        return user
    except HTTPException:
        raise
    except Exception as e:
        print(f"read user me error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not get user",
        )
