from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.domain.users.schemas import Token, RegisterUserInput, UserResponse, RegisterUserOutput
from app.domain.users.services import UserService
from datetime import timedelta

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 Days

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
)

userService = UserService()


@router.get("/", response_model=list[UserResponse])
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register_user(userData: RegisterUserInput):
    userService = UserService()

    try:
        # Check if user already exists
        existing_user = userService.get_user_by_email(userData.email)
        print(f"existing user: {existing_user}")
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )

        user: RegisterUserOutput = userService.register_user(userData)

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = userService.create_access_token(
            data={"id": user.id}, expires_delta=access_token_expires
        )
        return {
            "success": True,
            "message": "Registration successfull",
            "user": user,
            "access_token": access_token
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration unsuccessful",
        )


# @router.post("/login")
# async def login(
#     form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
# ) -> Token:
#     user = authenticate_user(fake_users_db, form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         data={"sub": user.username}, expires_delta=access_token_expires
#     )
#     return Token(access_token=access_token, token_type="bearer")
