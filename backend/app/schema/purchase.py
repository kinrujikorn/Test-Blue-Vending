from pydantic import BaseModel
from typing import Dict

class PurchaseRequest(BaseModel):
    product_id : int
    inserted_money: Dict[int,int]

class PurchaseResponse(BaseModel):
    success:bool
    message: str
    change: Dict[int,int] | None = None
