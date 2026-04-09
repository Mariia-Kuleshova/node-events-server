# Node Events Server

Express.js API server with MySQL database and user authentication.

---

## Features

- REST API for events
- MySQL database integration
- Pagination (LIMIT/OFFSET)
- Sorting by date or title
- Cursor-based pagination
- Database indexes for performance
- User authentication (bcrypt + sessions)
- Role-based access (admin / organizer)
- Protected routes

---

## Installation

Install dependencies:

npm install

Run server:

npm run dev

---

## Server

Server runs on:

http://localhost:3000

⚠ Note: Root route (/) is not defined. Use API endpoints like:

/events  
/login  
/register

---

## API Endpoints

### Auth

POST /register  
POST /login

---

### Events

GET /events

Query parameters:

- page – page number
- limit – number of items
- sort – date or title
- order – asc or desc

Example:

/events?page=1&limit=2&sort=date&order=asc

---

### Cursor pagination

/events?cursor=2

Returns events with id greater than cursor.

---

### Participants (Protected)

GET /participants/:eventId

⚠ Requires authentication

---

### Admin only

DELETE /events/:id

⚠ Only users with role "admin" can access

---

## Database

MySQL database: eventsdb

Tables:

- events
- participants
- users

Indexes:

- idx_events_date
- idx_events_title

Database schema and seed data:

database.sql

---

## Security

- Password hashing using bcrypt
- Session-based authentication
- Middleware for route protection
- Role-based authorization

---

## Author

Student project (Node.js + Express + MySQL)
