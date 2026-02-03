from pydantic import BaseModel

class Product(BaseModel):
    id:int
    name: str
    price: int
    stock: int

class ProductUpdate(BaseModel):
    stock: int

class ProductCreate(BaseModel):
    name: str
    price: int
    stock: int