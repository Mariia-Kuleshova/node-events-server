import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import { Server } from "socket.io";

// config & utils
import { db } from "./config/db.js";
import { logRequest } from "./utils/logger.js";
import { isAuth, isOrganizer } from "./utils/authMiddleware.js";
import { typeDefs, resolvers } from "./graphql.js";

const app = express();
const PORT = process.env.PORT || 3000;

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }),
);

app.use(express.json());
app.use(logRequest);

//auth

app.post("/register", async (req, res) => {
  try {
    const { email, password, role = "organizer" } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      return res.status(400).json({ error: "Користувач вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, role],
    );

    res.status(201).json({ message: "Користувач створений" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Користувача не знайдено" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Невірний пароль" });
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    res.json({ message: "Успішний вхід" });
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

//events

app.get("/events", async (req, res) => {
  try {
    let {
      page = 1,
      limit = 5,
      sort = "date",
      order = "asc",
      cursor,
    } = req.query;

    page = Number(page);
    limit = Number(limit);
    if (!["date", "title"].includes(sort)) sort = "date";
    if (!["asc", "desc"].includes(order)) order = "asc";

    let query = "";
    let params = [];

    // CURSOR pagination
    if (cursor) {
      query = `
        SELECT * FROM events
        WHERE id > ?
        ORDER BY id ASC
        LIMIT ?
      `;
      params = [cursor, limit];
    } else {
      const offset = (page - 1) * limit;

      query = `
        SELECT * FROM events
        ORDER BY ${sort} ${order}
        LIMIT ? OFFSET ?
      `;
      params = [limit, offset];
    }

    const [events] = await db.query(query, params);

    const nextCursor = events.length > 0 ? events[events.length - 1].id : null;

    res.json({
      data: events,
      nextCursor,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/events", isAuth, async (req, res) => {
  try {
    const { title, date, organizer } = req.body;

    if (!title || title.length < 3) {
      return res.status(400).json({ error: "Назва занадто коротка" });
    }

    const userId = req.session.user.id;

    const [result] = await db.query(
      "INSERT INTO events (title, date, organizer, creatorId) VALUES (?, ?, ?, ?)",
      [title, date, organizer, userId],
    );

    res.json({ message: "Подію створено", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.put("/events/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, organizer } = req.body;

    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Подію не знайдено" });
    }
    const event = rows[0];

    if (event.creatorId !== req.session.user.id) {
      return res.status(403).json({ error: "Це не ваша подія" });
    }

    await db.query(
      "UPDATE events SET title = ?, date = ?, organizer = ? WHERE id = ?",
      [title, date, organizer, id],
    );

    res.json({ message: "Подію оновлено" });
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.delete("/events/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Подію не знайдено" });
    }

    const event = rows[0];

    if (
      req.session.user.role !== "admin" &&
      event.creatorId !== req.session.user.id
    ) {
      return res.status(403).json({ error: "Немає доступу" });
    }

    await db.query("DELETE FROM events WHERE id = ?", [id]);

    res.json({ message: "Подію видалено" });
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

//participants

app.post("/participants", async (req, res) => {
  try {
    const { name, email, eventId } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Невірний email" });
    }

    await db.query(
      "INSERT INTO participants (name, email, eventId) VALUES (?, ?, ?)",
      [name, email, eventId],
    );

    res.json({ message: "Учасник доданий" });
  } catch (error) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.get("/participants/:eventId", isAuth, isOrganizer, async (req, res) => {
  try {
    const { eventId } = req.params;

    const [participants] = await db.query(
      "SELECT * FROM participants WHERE eventId = ?",
      [eventId],
    );

    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//socket.io

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

//graphql

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
  });

  await server.start();

  server.applyMiddleware({
    app,
    cors: {
      origin: ["https://studio.apollographql.com", "http://localhost:3000"],
      credentials: true,
    },
  });

  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(
      `GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`,
    );
  });
};

startServer();
