import { Request, Response } from "express";
import { AlbumService } from "../services/albumService";
import { statusCodes } from "../utils/statusCodes";
import { AlbumFilter } from "../models/filters/albumFilter";

export class AlbumController {
  albumService: AlbumService;

  constructor() {
    this.albumService = new AlbumService();
  }

  // If query params are provided, the following fuction will filter albums, otherwise it will return all
  getAlbums = async (request: Request, response: Response) => {
    const band = request.query.band as string;
    const from = parseInt(request.query.from as string);
    const to = parseInt(request.query.to as string);

    if (from > to) {
      response.statusCode = statusCodes.BAD_REQUEST;
      return response.json({
        error: "'from' value should be lower than 'to'",
      });
    }

    const albumFilter = new AlbumFilter(band, from, to);

    const albums = await this.albumService.getAlbums(albumFilter);

    if (albums.length > 0) {
      response.statusCode = statusCodes.SUCCESS;
      return response.json(albums);
    }

    response.statusCode = statusCodes.NOT_FOUND;
    return response.json({
      error: "No albums were found for the parameters provided",
    });
  };

  getAlbumById = async (request: Request, response: Response) => {
    const result = await this.albumService.getAlbumById(
      parseInt(request.params.id)
    );

    if (result) {
      response.statusCode = statusCodes.SUCCESS;
      return response.json(result);
    }

    response.statusCode = statusCodes.NOT_FOUND;
    return response.json({
      error: "No album with the provided id exists",
    });
  };
}
