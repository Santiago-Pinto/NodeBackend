import express, { Application } from "express";
import { TestRouter } from "../src/api/routes/testRoutes";
import { AlbumRouter } from "../src/api/routes/albumRoutes";
import { Sequelize } from "sequelize";
import { config } from "./api/config/config";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Here go the routers
app.use(TestRouter);
app.use("/album", AlbumRouter); //This one already handles all calls with the /album prefix
//

//DB connection
const connectDB = async () => {
  const sequelize = new Sequelize(config.DB_URI);
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log("Connection has been established successfully.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Unable to connect to the database:", error);
  }
};
//

app.listen(PORT, async () => {
  await connectDB();
  // eslint-disable-next-line no-console
  console.log(`Server listening on port: ${PORT}`);
});

export default app; //Need to export the app for test purposes
