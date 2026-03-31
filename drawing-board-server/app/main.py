from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import socketio
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from app.kafka_producer.producer import kafka_producer

load_dotenv()

from .api.routes import users
from .api.routes import files
from .api.routes import internal
from .socket_io import sio

CLIENT_URLS = os.getenv("CLIENT_URLS", "http://localhost:5173").split(",")

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await kafka_producer.flush()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CLIENT_URLS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the uploads directory to serve files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(users.router)
app.include_router(files.router)
app.include_router(internal.router)


@app.get("/")
def root():
    return {"message": "Welcome to Drawing Board Server"}

app = socketio.ASGIApp(sio, other_asgi_app=app)
