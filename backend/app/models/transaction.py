from sqlalchemy import Column, Integer, String ,DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)

    price = Column(Integer, nullable=False)
    total_inserted = Column(Integer, nullable=False)
    change_amount = Column(Integer, nullable=False)

    status = Column(String, nullable=False)  # SUCCESS / FAILED
    created_at = Column(DateTime(timezone=True) ,server_default=func.now())