from app.database import SessionLocal
from app.models.product import Product
from app.models.machine_cash import MachineCash

def seed():
    db = SessionLocal()

    # Defend Same Seed
    if db.query(Product).first():
        print("DB already seeded")
        db.close()
        return

    products = [
        Product(name="Coke", price=20, stock=10),
        Product(name="Pepsi", price=20, stock=10),
        Product(name="Water", price=10, stock=20),
    ]

    cash = [
        MachineCash(denomination=1, quantity=100),
        MachineCash(denomination=5, quantity=100),
        MachineCash(denomination=10, quantity=100),
        MachineCash(denomination=20, quantity=50),
        MachineCash(denomination=50, quantity=50),
        MachineCash(denomination=100, quantity=20),
        MachineCash(denomination=500, quantity=10),
        MachineCash(denomination=1000, quantity=5),
    ]

    db.add_all(products)
    db.add_all(cash)
    db.commit()
    db.close()

    print("Seed completed ✅")

if __name__ == "__main__":
    seed()