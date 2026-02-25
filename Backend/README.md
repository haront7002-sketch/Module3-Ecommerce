# Backend (API)

Express + MySQL backend for Module3-Ecommerce.

## Requirements

- Node.js 20+ (recommended: Node 20 LTS)
- MySQL 8+

## Setup

```sh
cd Backend
npm install
```

## Environment Variables

Create `Backend/.env` with:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=s_o_s
```

## Database

Import the SQL schema/data from:

- `Backend/SOS.sql`

Then make sure `DB_NAME` in `.env` matches the imported database name.

## Run

Development (auto-reload):

```sh
npm run dev
```

Production:

```sh
npm start
```

Server will run on:

- `http://localhost:3000`

## API Base Paths

- `GET /` - health check message
- `/api/*` - carts, favourites, orders, tickets
- `/api/auth/*` - auth endpoints
