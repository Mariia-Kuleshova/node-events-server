import http from "node:http";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";

import { PORT, API_ROUTE } from "./config/config.js";
import { logRequest } from "./utils/logger.js";

const server = http.createServer(async (req, res) => {
  logRequest(req);

  res.setHeader("Content-Type", "application/json");

  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (url.pathname === API_ROUTE && req.method === "GET") {
      const data = await readFile("./data/events.json", "utf-8");

      res.statusCode = 200;
      res.end(data);
    } else {
      res.statusCode = 404;

      res.end(
        JSON.stringify({
          error: "Route not found",
        }),
      );
    }
  } catch (error) {
    res.statusCode = 500;

    res.end(
      JSON.stringify({
        error: "Internal server error",
      }),
    );
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}${API_ROUTE}`);
});
