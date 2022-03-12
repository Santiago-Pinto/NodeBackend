import { Request, Response } from "express";

export const root = (request: Request, response: Response) => {
  response.statusCode = 200;
  return response.json({ message: "Server Alive !" });
};
