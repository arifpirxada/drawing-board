from fastapi import FastAPI

from .api.routes import users
from .api.routes import files

app = FastAPI()

app.include_router(users.router)
app.include_router(files.router)

@app.get("/")
def root():
    return {"message": "Welcome to Drawing Board Server"}
