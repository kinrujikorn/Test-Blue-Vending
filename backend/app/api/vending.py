from fastapi import APIRouter , HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.product import Product
from app.models.machine_cash import MachineCash
from app.models.transaction import Transaction
from app.schema.product import ProductUpdate,ProductCreate
from app.schema.purchase import PurchaseRequest ,PurchaseResponse
from app.schema.machine_cash import MachineCashUpdate

router = APIRouter(prefix="", tags=["vending"])


DENOMINATIONS = [1000, 500, 100, 50, 20, 10, 5, 1]

def can_make_change(change_amount: int, machine_cash: dict):
    change = {}

    for d in DENOMINATIONS:
        available = machine_cash.get(d, 0)
        need = change_amount // d

        use = min(need, available)

        if use > 0:
            change[d] = use
            change_amount -= d * use

    if change_amount == 0:
        return True, change

    return False, {}

def fetch_machine_cash_map(db: Session) -> dict:
    cash_rows = db.query(MachineCash).all()
    return {row.denomination: row.quantity for row in cash_rows}


def log_transaction(
    db: Session,
    product_id: int | None,
    price: int,
    total_inserted: int,
    change_amount: int,
    status: str
):
    tx = Transaction(
        product_id=product_id,
        price=price,
        total_inserted=total_inserted,
        change_amount=change_amount,
        status=status
    )
    db.add(tx)



@router.get("/products")
def get_products():
    db: Session = SessionLocal()

    products = db.query(Product).all()

    db.close()
    return products

@router.get("/machine-cash")
def get_machine_cash():
    db: Session = SessionLocal()
    machine_cash = db.query(MachineCash).all()
    db.close()
    return machine_cash

@router.post("/purchase", response_model=PurchaseResponse)
def purchase(req: PurchaseRequest):
    db: Session = SessionLocal()

    

    product = db.query(Product).filter(Product.id == req.product_id).first()

    if not product:
        db.close()
        return PurchaseResponse(success=False, message="Product not found")

    if product.stock <= 0:
        db.close()
        return PurchaseResponse(success=False, message="Out of stock")

    total_money = sum(
        denom * qty
        for denom, qty in req.inserted_money.items()
    )

    if total_money < product.price:
        log_transaction(
            db,
            product_id=product.id,
            price=product.price,
            total_inserted=total_money,
            change_amount=0,
            status="FAILED"
        )
        db.commit()
        db.close()
        return PurchaseResponse(
            success=False,
            message="Not enough money"
        )

    change_amount = total_money - product.price
    machine_cash = fetch_machine_cash_map(db)
    ok, change = can_make_change(change_amount, machine_cash)

    if not ok:
        db.close()
        return PurchaseResponse(
            success=False,
            message="Cannot make change please insert less money"
    )
    for d, qty in change.items():
        row = db.query(MachineCash).filter(
            MachineCash.denomination == d
        ).first()
        row.quantity -= qty

    # เอาเงินที่ user ใส่เข้าตู้
    for d, qty in req.inserted_money.items():
        row = db.query(MachineCash).filter(
        MachineCash.denomination == d
        ).first()
        row.quantity += qty

    product.stock -= 1

    log_transaction(
    db,
    product_id=product.id,
    price=product.price,
    total_inserted=total_money,
    change_amount=change_amount,
    status="SUCCESS"
    )

    db.commit()
    db.refresh(product)
    db.close()

    
    return PurchaseResponse(
        success=True,
        message="Purchase success",
        change=change
    )


@router.put("/products/{product_id}")
def update_product_stock(product_id: int, payload: ProductUpdate):
    if payload.stock < 0:
        raise HTTPException(
            status_code=400,
            detail="Stock cannot be less than 0"
        )

    db: Session = SessionLocal()

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        db.close()
        raise HTTPException(status_code=404, detail="Product not found")

    product.stock = payload.stock
    db.commit()
    db.refresh(product)
    db.close()

    return product

@router.put("/machine-cash/{cash_id}")
def update_machine_cash(cash_id: int, payload: MachineCashUpdate):
    if payload.quantity < 0:
        raise HTTPException(status_code=400, detail="Quantity must be >= 0")

    db: Session = SessionLocal()

    cash = db.query(MachineCash).filter(MachineCash.id == cash_id).first()

    if not cash:
        db.close()
        raise HTTPException(status_code=404, detail="Cash not found")

    cash.quantity = payload.quantity

    db.commit()
    db.refresh(cash)
    db.close()

    return {
        "message": "Machine cash updated",
        "cash": cash
    }

@router.post("/products")
def create_product(product: ProductCreate):
    db: Session = SessionLocal()
    new_product = Product(
        name=product.name,
        price=product.price,
        stock=product.stock
    )
    db.add(new_product)
    db.commit()
    return new_product


@router.delete("/products/{product_id}")
def delete_product(product_id: int):
    db: Session = SessionLocal()

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        db.close()
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    db.close()

    return { "message": "Product deleted" }