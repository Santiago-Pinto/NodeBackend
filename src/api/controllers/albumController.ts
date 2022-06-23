import { Request, Response } from "express";
import { AlbumService } from "../services/albumService";

export class AlbumController {
  albumService: AlbumService;

  constructor() {
    this.albumService = new AlbumService();
  }

  // If query params are provided, the following fuction will filter albums, otherwise it will return all
  getAlbums = (request: Request, response: Response) => {
    const from = parseInt(request.query.from as string);
    const to = request.query.to ? parseInt(request.query.to as string) : from;
    const result = this.albumService.getAlbums(from, to);

    if (result.length > 0) {
      response.statusCode = 200;
      return response.json(result);
    }

    response.statusCode = 404;
    return response.json({
      error: "No albums were found for the years provided",
    });
  };

  getAlbumById = (request: Request, response: Response) => {
    const result = this.albumService.getAlbumById(parseInt(request.params.id));

    if (result) {
      response.statusCode = 200;
      return response.json(result);
    }

    response.statusCode = 404;
    return response.json({
      error: "No album with the provided id exists",
    });
  };
}
