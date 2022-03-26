import express from "express";
import { TestRouter } from "../src/api/routes/testRoutes";
import { AlbumRouter } from "../src/api/routes/albumRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Here go the routers
app.use(TestRouter);
app.use("/album", AlbumRouter); //This one already handles all calls with the /album prefix
///

app.listen(PORT, (): void => {
  console.log(`Server listening on port: ${PORT}`);
});
