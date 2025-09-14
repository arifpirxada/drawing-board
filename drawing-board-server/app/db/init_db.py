from .db import Base, engine
from app.domain.users.models import User

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()