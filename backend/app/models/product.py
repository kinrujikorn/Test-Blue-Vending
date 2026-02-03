from sqlalchemy import Column, Integer, String
from app.database import Base

class Product(Base):
    __tablename__ = "products"  # ⚠️ ต้องตรงกับ table ใน Postgres

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Integer)
    stock = Column(Integer)