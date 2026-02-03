# Simple Vending Machine (SE Challenge)

This project is a **Full-stack Web Application** developed as part of the **SE Challenge**.  
The application simulates a **Simple Vending Machine** with product selection, payment handling, change calculation, and admin stock management.

---

## 🐳 Docker Setup

```bash
docker-compose up --build
```

This will start:

- Backend (FastAPI)
- PostgreSQL
- Frontend

---

## 🛠️ Setup Instructions (Local) (Optional)

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
.
├── backend/                     # Backend (FastAPI + PostgreSQL)
│   ├── app/
│   │   ├── api/                 # API route definitions
│   │   │   └── vending.py       # Vending machine related endpoints
│   │   ├── models/              # SQLAlchemy ORM models
│   │   │   ├── product.py
│   │   │   ├── machine_cash.py
│   │   │   └── transaction.py
│   │   ├── schema/              # Pydantic schemas (request/response)
│   │   ├── tests/               # Unit tests (pytest)
│   │   │   ├── test_products.py
│   │   │   ├── test_machine_cash.py
│   │   │   └── test_purchase.py
│   │   ├── database.py          # Database connection & session
│   │   ├── main.py              # FastAPI application entry point
│   │   └── seed.py              # Initial database seeding script
│   ├── venv/                    # Python virtual environment
│   ├── requirements.txt         # Backend dependencies
│   ├── Dockerfile               # Backend Docker configuration
│   └── vending.db               # Local database file (for development/testing)
│
├── frontend/                    # Frontend (Next.js + React)
│   ├── blue-vending/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── admin/           # Admin page (product & cash management)
│   │   │   │   └── page.tsx
│   │   │   ├── api/             # Frontend API helpers
│   │   │   ├── components/      # Reusable UI components
│   │   │   │   ├── MoneyInput.tsx
│   │   │   │   └── ProductCard.tsx
│   │   │   ├── lib/             # Utility/helper functions
│   │   │   ├── globals.css      # Global styles
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── page.tsx         # Main vending machine page
│   │   ├── public/              # Static assets
│   │   ├── node_modules/        # Frontend dependencies
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   └── postcss.config.mjs
│
├── docker-compose.yml            # Docker Compose for full-stack setup
├── .gitignore
├── README.md                    # Project documentation
└── package-lock.json

```

---

## 🧠 Design & Assumptions

- The vending machine logic (money validation, change calculation, stock updates) is handled **on the backend**.
- Frontend is responsible only for UI and API communication.
- Change calculation prioritizes **larger denominations first**.
- Transactions are recorded for every purchase (SUCCESS / FAILED).
- Seed data is required so reviewers can run the project immediately.

---

Thank you for reviewing 🙏
