from pydantic import BaseModel

class MachineCashUpdate(BaseModel):
    quantity: int