# Vibe Commerce - Mock E-Com Cart

## Overview

A simple full-stack e-commerce cart app for internship screening.

- Add / Remove products
- View cart items and total
- Checkout (mock receipt)
- MongoDB persistence
- REST APIs (Express + React frontend)

## Tech Stack

**Frontend:** React, CSS, API integration
**Backend:** Node.js, Express
**Database:** MongoDB (Mongoose)

## Setup Instructions

### Backend Setup

1. Open terminal in the backend directory and run `npm install`.
2. Start the server by running `node index.js or nodemon index.js`.
3. Server runs on: http://localhost:5000

### Frontend Setup

1. Open terminal in the frontend directory and run `npm install`.
2. Start the frontend by running `npm run dev`.
3. Frontend runs on: http://localhost:5173/

## API Endpoints

Method	Endpoint	Description
GET	/api/products	Get all products
POST	/api/cart	Add product to cart
DELETE	/api/cart/:id	Remove from cart
GET	/api/cart	View cart + total Price
POST	/api/checkout	Mock checkout receipt

## Screenshots

(Add 2–3 screenshots of product page, cart page, checkout)

## Demo Video

(Attach Loom or YouTube unlisted video link here)

## Author

Amit Maurya
Full Stack Developer — Assignment for Vibe Commerce

