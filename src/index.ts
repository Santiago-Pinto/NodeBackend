import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Hello World !" });
});

app.listen(PORT, (): void => {
  console.log(`Server listening on port: ${PORT}`);
});
