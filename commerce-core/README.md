# CommerceCore API

A production-minded e-commerce backend built with **TypeScript, Express, PostgreSQL, and Prisma**. It demonstrates secure API design, role-based authorization, transactional ordering, and containerized local deployment.

## What it does

- Customer registration/login with bcrypt password hashing and one-hour JWTs
- Public, paginated product catalog with categories
- Admin-only product and order-status operations
- Persistent carts and cart item updates
- Checkout using a PostgreSQL **serializable transaction** and conditional stock decrement, protecting against overselling during concurrent purchases
- Consistent JSON errors, request validation with Zod, Helmet, CORS, structured request logs, health endpoint, Docker, and a starter automated test

## Run locally

**Prerequisites:** Node.js LTS, Docker Desktop (running), and an internet connection for the first `npm install`.

In Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm install
docker compose up -d db
npx prisma db push
npm run db:seed
npm run dev
```

Then open `http://localhost:4000/health`. The seed creates a product and an admin account: `admin@commercecore.dev` / `Admin123!`. Change this password in a real project.

Or launch the API and PostgreSQL together:

```bash
docker compose up --build
```

The API is at `http://localhost:4000/api/v1`; health is `/health`.

## API quick reference

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Create customer and cart |
| POST | `/auth/login` | Receive JWT |
| GET | `/products?page=1&limit=20` | Browse active products |
| POST/PATCH | `/products` | Admin catalog management |
| GET/POST/DELETE | `/cart`, `/cart/items` | Manage customer cart |
| POST | `/orders/checkout` | Atomically reserve stock and create order |
| GET | `/orders` | Customer order history |
| PATCH | `/orders/:id/status` | Admin fulfillment state |

Use `Authorization: Bearer <token>` for protected routes. Monetary amounts are integer minor units (e.g., `1999` = $19.99), avoiding floating-point currency errors.

## Architecture notes

Routes remain thin; `services/orders.ts` owns checkout’s business-critical transaction. Prisma models define relations and indexes. Replace the payment reference field with a Stripe/PayPal adapter and confirm payment through a signed webhook before setting an order to `PAID` in a real deployment.

## Resume wording

“Built CommerceCore, a TypeScript/Express e-commerce REST API with PostgreSQL/Prisma, JWT RBAC, validated catalog and cart workflows, and serializable transactional checkout that prevents inventory oversells; containerized with Docker.”

## Production extensions

Add Redis rate limits/cache, payment-webhook signature verification, idempotency keys for checkout, object storage for product images, OpenAPI generation, CI, observability, and background jobs for fulfillment emails.
