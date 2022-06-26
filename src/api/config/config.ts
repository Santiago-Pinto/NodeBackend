export const config = {
  HOST: "localhost",
  DB_URI:
    process.env.URI ||
    "postgres://localhost:development940205@localhost:5432/Node-Backend-DB",
  NODE_ENV: process.env.NODE_ENV || "development",
};
