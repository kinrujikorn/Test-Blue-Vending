from fastapi import FastAPI
from app.database import engine, Base
from app.api import vending
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.seed import seed
import time
import app.models


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    time.sleep(2)
    Base.metadata.create_all(bind=engine)
    seed() 
    yield
    # shutdown 
    

app = FastAPI(lifespan=lifespan)

app.include_router(vending.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
