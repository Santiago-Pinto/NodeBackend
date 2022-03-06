import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Hello World !" });
});

app.listen(port, (): void => {
  console.log("Server Alive !");
});
