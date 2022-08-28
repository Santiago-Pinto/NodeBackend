import { Request, Response } from "express";
import { SongService } from "../services/songService";
import { statusCodes } from "../utils/statusCodes";

export class SongController {
  songService: SongService;

  constructor() {
    this.songService = new SongService();
  }

  // If query params are provided, the following fuction will filter albums, otherwise it will return all
  getSongs = async (request: Request, response: Response) => {
    return response.status(statusCodes.NOT_FOUND).json({
      error: "Endpoint not implemented",
    });
  };
}
