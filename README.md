# 🎯 Event Management Full-Stack System

## 📌 Description

This project is a full-stack event management system built with Node.js, Express, GraphQL, MySQL, and Socket.io.

It provides both REST and GraphQL APIs, supports authentication, pagination, and real-time communication.

---

## ⚙️ Technologies

* Node.js
* Express.js
* MySQL
* GraphQL (Apollo Server)
* Socket.io
* express-session
* bcrypt
* dotenv

---

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

### Run project

```bash
npm run dev
```

---

## 🌐 Endpoints

### REST API

* GET /events
* POST /events
* PUT /events/:id
* DELETE /events/:id
* POST /participants
* GET /participants/:eventId

---

### GraphQL

```bash
http://localhost:3000/graphql
```

Example query:

```graphql
query {
  getEvents {
    id
    title
    participants {
      name
      email
    }
  }
}
```

---

## 🔐 Authentication

* Registration: POST /register
* Login: POST /login

Uses:

* express-session
* bcrypt password hashing

---

## 📊 Pagination

### Offset

```bash
/events?page=1&limit=5
```

### Cursor-based (Advanced)

```bash
/events?cursor=1
```

Response:

```json
{
  "data": [...],
  "nextCursor": 5
}
```

---

## 💬 Real-time Chat

Implemented with Socket.io.

Features:

* real-time messaging
* no page reload
* WebSocket connection

---

## 🧠 Advanced Features

✔ Hybrid API (REST + GraphQL)
✔ Nested GraphQL queries
✔ Session-based authentication
✔ Role-based access control
✔ Cursor-based pagination
✔ Real-time chat (Socket.io)
✔ Environment variables support

---

## ☁️ Deployment

Project is ready for deployment:

* Frontend → Vercel
* Backend → Render / Railway
* Database → Railway / MySQL

---

## 📁 Structure

```
config/
utils/
graphql.js
server.js
.env
README.md
```

---

## 🏁 Conclusion

This project demonstrates a complete event management system with modern backend technologies. It includes both basic functionality and advanced features such as GraphQL, real-time communication, and cursor-based pagination.

---
