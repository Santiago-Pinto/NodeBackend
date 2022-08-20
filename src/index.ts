import express, { Application, json } from "express";
import { AlbumRouter } from "../src/api/routes/albumRoutes";
import db from "./api/config/db";

const app: Application = express();
const PORT = process.env.PORT || 3000;
// Here go the routers
app.use(json());
app.use("/album", AlbumRouter); //This one already handles all calls with the /album prefix
//

//DB connection
const testConnection = async () => {
  try {
    await db.connection.authenticate(); // Just checks if the connection to the DB was successful, can be removed
    // eslint-disable-next-line no-console
    console.log("Connection has been established successfully.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Unable to connect to the database:", error);
  }
};
//

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, async () => {
    await testConnection();
    // eslint-disable-next-line no-console
    console.log(`Server listening on port: ${PORT}`);
  });
}

export default app; //Need to export the app for test purposes
