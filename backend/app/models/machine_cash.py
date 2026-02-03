from sqlalchemy import Column, Integer, String
from app.database import Base

class MachineCash(Base):
    __tablename__ = "machine_cash"  # ⚠️ ต้องตรงกับ table ใน Postgres

    id = Column(Integer, primary_key=True, index=True)
    denomination = Column(Integer, nullable=False)
    quantity = Column(Integer)