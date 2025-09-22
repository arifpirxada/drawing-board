from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv

load_dotenv()

from .api.routes import users
from .api.routes import files

CLIENT_URL = os.getenv("CLIENT_URL", "http://localhost:5173")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"{CLIENT_URL}"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(files.router)


@app.get("/")
def root():
    return {"message": "Welcome to Drawing Board Server"}
