import express from "express";
import { readFile } from "fs/promises";
import { logRequest } from "./utils/logger.js";

const app = express();

const PORT = 3000;

app.use(logRequest);

app.get("/events", async (req, res) => {
  try {
    const data = await readFile("./data/events.json", "utf-8");
    let events = JSON.parse(data);

    let { page = 1, limit = 5, sort, order = "asc" } = req.query;

    page = Number(page);
    limit = Number(limit);

    // validation
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        error: "page та limit повинні бути більше 0",
      });
    }

    // перевірка sort
    if (sort && sort !== "date" && sort !== "title") {
      return res.status(400).json({
        error: "sort може бути тільки date або title",
      });
    }

    // перевірка order
    if (order !== "asc" && order !== "desc") {
      return res.status(400).json({
        error: "order може бути тільки asc або desc",
      });
    }

    // sorting
    if (sort === "date") {
      events.sort((a, b) =>
        order === "desc"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date),
      );
    }

    if (sort === "title") {
      events.sort((a, b) =>
        order === "desc"
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title),
      );
    }

    // pagination
    const start = (page - 1) * limit;
    const end = start + limit;

    const result = events.slice(start, end);

    res.json({
      page,
      limit,
      total: events.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/events`);
});
