# Simple Vending Machine (SE Challenge)

This project is a **Full-stack Web Application** developed as part of the **SE Challenge (4 Days)**.  
The application simulates a **Simple Vending Machine** with product selection, payment handling, change calculation, and admin stock management.

---

## 🧩 Tech Stack

### Frontend

- **Next.js (React + TypeScript)**
- TailwindCSS (UI & Styling)

### Backend

- **Python – FastAPI**
- SQLAlchemy (ORM)

### Database

- **PostgreSQL**

### Testing

- **Pytest** (Unit Tests)

### Containerization

- **Docker / Docker Compose**

---

## 🎯 Features

### Customer Side

- Accepts coins & banknotes: **1, 5, 10, 20, 50, 100, 500, 1000 THB**
- View available products with price and stock
- Select product
- Insert money
- Validate:
  - Enough money to buy product
  - Enough change in machine
  - Product stock availability
- Purchase product
- Receive change

### Admin Side (No Login – for Demo Purpose)

- Add new product
- Edit product stock
- Delete product
- View and update machine cash

> ⚠️ Authentication is intentionally omitted to keep the challenge simple and focused on core logic.

---

## 🗂️ Project Structure

```
backend/
├── app/
│   ├── api/            # API routes
│   ├── models/         # SQLAlchemy models
│   ├── tests/          # Unit tests (pytest)
│   ├── database.py     # DB connection
│   └── main.py         # FastAPI entry point
├── seed.py             # Seed initial data
├── requirements.txt
└── docker-compose.yml

frontend/
├── app/
├── components/
├── lib/
└── package.json
```

---

## 🧠 Design & Assumptions

- The vending machine logic (money validation, change calculation, stock updates) is handled **on the backend**.
- Frontend is responsible only for UI and API communication.
- Change calculation prioritizes **larger denominations first**.
- Transactions are recorded for every purchase (SUCCESS / FAILED).
- Seed data is required so reviewers can run the project immediately.

---

## 🛠️ Setup Instructions (Local)

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

#### Create Database

Create a PostgreSQL database named:

```
vending_machine
```

Update database config if needed:

```
DATABASE_URL=postgresql+psycopg2://admin:admin123@localhost:5432/vending_machine
```

#### Run Migration (Auto-create tables)

```bash
uvicorn app.main:app --reload
```

#### Seed Initial Data

```bash
python seed.py
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:3000
```

---

## 🧪 Running Tests

All unit tests are located in `backend/app/tests`

```bash
cd backend
pytest -v
```

✔️ Tests cover:

- Products API
- Machine cash update
- Purchase logic (success & failure cases)

---

## 🐳 Docker Setup (Optional)

```bash
docker-compose up --build
```

This will start:

- Backend (FastAPI)
- PostgreSQL
- Frontend

---

Thank you for reviewing 🙏
