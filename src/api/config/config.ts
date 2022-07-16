import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
});

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "localhost",
  PORT: process.env.PORT || 3000,
  DB_URI:
    process.env.DB_URI ||
    `postgres://localhost:${process.env.DB_PASS}@localhost:5432/Node-Backend-DB`,
};
