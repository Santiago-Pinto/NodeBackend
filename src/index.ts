import express, { Application } from "express";
import { TestRouter } from "../src/api/routes/testRoutes";
import { AlbumRouter } from "../src/api/routes/albumRoutes";
import { Sequelize } from "sequelize";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Here go the routers
app.use(TestRouter);
app.use("/album", AlbumRouter); //This one already handles all calls with the /album prefix
///

//DB connection
const sequelize = new Sequelize("database", "username", "password", {
  host: process.env.HOST || "localhost",
  dialect: "postgres" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});
//

app.listen(PORT, (): void => {
  console.log(`Server listening on port: ${PORT}`);
});

export default app; //Need to export the app for test purposes
