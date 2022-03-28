import { Request, Response } from "express";
import {
  getAlbums as getAlbumsByYearRange,
  getAlbumById as getAlbumFromId,
} from "../services/albumService";

// If query params are provided, the following fuction will filter albums, otherwise it will return all
export const getAlbums = (request: Request, response: Response) => {
  let result;
  const from = parseInt(request.query.from as string);
  const to = request.query.to ? parseInt(request.query.to as string) : from;
  result = getAlbumsByYearRange(from, to);

  if (result.length > 0) {
    response.statusCode = 200;
    return response.json(result);
  }

  response.statusCode = 404;
  return response.json({
    error: "No albums were found for the years provided",
  });
};

// This is an example with header params
export const getAlbumById = (request: Request, response: Response) => {
  const result = getAlbumFromId(parseInt(request.params.id));

  if (result) {
    response.statusCode = 200;
    return response.json(result);
  }

  response.statusCode = 404;
  return response.json({
    error: "No album with the provided id exists",
  });
};
