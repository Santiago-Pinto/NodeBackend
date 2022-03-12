import express from "express";
import { TestRouter } from "../src/api/routes/testRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Here go the routers
app.use(TestRouter);
///

app.listen(PORT, (): void => {
  console.log(`Server listening on port: ${PORT}`);
});
