# Backend API

Express + MySQL backend for the event booking app.

## Requirements
- Node.js 20+
- MySQL 8+

## Install
```sh
cd Backend
npm install
```

## Environment Variables
Create `Backend/.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=s_o_s
JWT_SECRET=secret
JWT_EXPIRES_IN=7d
```

## Database Setup
Import:
- `Backend/S_O_S.sql`

Then ensure `DB_NAME` in `.env` matches your imported DB.

## Run
Development:
```sh
npm run dev
```

Production:
```sh
npm start
```

API base URL:
- `http://localhost:3000`

## Main Routes
Auth:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Users:
- `GET /user` (protected)
- `PUT /user` (protected)
- `PUT /user/preferences` (protected)

Events/Categories:
- `GET /events`
- `GET /events/:id`
- `GET /categories`
- `GET /categories/:category_id`
- `POST /categories`
- `PATCH /categories/:category_id`
- `DELETE /categories/:category_id`

Cart/Favourites:
- `GET /cart/:user_id`
- `POST /cart`
- `PATCH /cart/:cart_id`
- `DELETE /cart/:cart_id`
- `DELETE /cart/user/:user_id`
- `GET /favourites/:user_id`
- `POST /favourites`
- `DELETE /favourites`

Orders/Tickets:
- `POST /checkout`
- `POST /orders`
- `POST /orders/items`
- `GET /orders/:order_id`
- `GET /users/:user_id/orders`
- `PATCH /orders/:order_id/status`
- `GET /orders/:order_id/tickets`
- `POST /orders/:order_id/tickets/issue`

Preferences:
- `POST /preferences`
