from .models import User
from .schemas import RegisterUserInput, RegisterUserOutput
from app.db.db import SessionLocal
from sqlalchemy.exc import SQLAlchemyError

class UserRepository:

    def __init__(self):
        self.session = SessionLocal()

    def get_user_by_email(self, email: str):
        try:
            return self.session.query(User).filter(User.email == email).first()
        except SQLAlchemyError as e:
            self.session.rollback()
            raise Exception(f"Database error during get user by email: {str(e)}")

    def create_user(self, userData: RegisterUserInput):
        try:
            new_user = User(name=userData.name, email=userData.email, password=userData.password)

            self.session.add(new_user)
            self.session.commit()
            self.session.refresh(new_user)

            user = RegisterUserOutput(
                id=str(new_user.id),
                name=str(new_user.name),
                email=str(new_user.email),
            )

            return user
        except SQLAlchemyError as e:
            self.session.rollback()
            raise Exception(f"Database error during user creation: {str(e)}")