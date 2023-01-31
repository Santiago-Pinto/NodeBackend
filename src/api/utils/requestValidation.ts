import { Request } from "express";

export const validateRequestBody = (request: Request) => {
  if (!Object.keys(request.body).length) {
    return "Invalid request, missing request body";
  }
};
