import express from "express";
import { logRequest } from "./utils/logger.js";
import { db } from "./config/db.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logRequest);

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

    // validation
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        error: "page та limit повинні бути більше 0",
      });
    }

    if (!["date", "title"].includes(sort)) {
      return res.status(400).json({
        error: "sort може бути тільки date або title",
      });
    }

    if (!["asc", "desc"].includes(order)) {
      return res.status(400).json({
        error: "order може бути тільки asc або desc",
      });
    }

    let query = "";
    let params = [];

    //cursor pagination
    if (cursor) {
      query = `
    SELECT * FROM events
    WHERE id > ?
    ORDER BY id
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

    const [count] = await db.query("SELECT COUNT(*) as total FROM events");

    res.json({
      page,
      limit,
      total: count[0].total,
      data: events,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.get("/participants/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const [participants] = await db.query(
      "SELECT * FROM participants WHERE eventId = ?",
      [eventId],
    );

    res.json(participants);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
