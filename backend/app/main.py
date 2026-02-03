from fastapi import FastAPI
from app.database import engine, Base
from app.api import vending
from fastapi.middleware.cors import CORSMiddleware
import time
from app.models import product

app = FastAPI()

@app.on_event("startup")
def startup():
    time.sleep(2)
    Base.metadata.create_all(bind=engine)

app.include_router(vending.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
