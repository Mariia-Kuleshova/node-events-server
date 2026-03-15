import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "eventsdb",
  waitForConnections: true,
  connectionLimit: 10,
});
