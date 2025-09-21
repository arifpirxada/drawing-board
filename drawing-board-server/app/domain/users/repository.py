from .models import User
from .schemas import RegisterUserInput, RegisterUserOutput
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select

class UserRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_user_by_email(self, email: str):
        try:
            stmt = select(User).where(User.email == email)
            result = await self.session.execute(stmt)
            return result.scalar_one_or_none() 
        except SQLAlchemyError as e:
            await self.session.rollback()
            raise Exception(f"Database error during get user by email: {str(e)}")

    async def get_user_by_id(self, id: str):
        try:
            stmt = select(User).where(User.id == id)
            result = await self.session.execute(stmt)
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            await self.session.rollback()
            raise Exception(f"Database error during get user by id: {str(e)}")

    async def create_user(self, userData: RegisterUserInput):
        try:
            new_user = User(name=userData.name, email=userData.email, password=userData.password)

            self.session.add(new_user)
            await self.session.commit()
            await self.session.refresh(new_user)

            user = RegisterUserOutput(
                id=str(new_user.id),
                name=str(new_user.name),
                email=str(new_user.email),
            )

            return user
        except SQLAlchemyError as e:
            await self.session.rollback()
            raise Exception(f"Database error during user creation: {str(e)}")