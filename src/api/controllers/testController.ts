import { Request, Response } from "express";
import { statusCodes } from "../utils/statusCodes";

export const root = (request: Request, response: Response) => {
  response.statusCode = statusCodes.SUCCESS;
  return response.json({ message: "Server Alive !" });
};
