import { Request, Response } from "express";
import { SongFilter } from "../models/filters/songFilter";
import { SongService } from "../services/songService";
import { statusCodes } from "../utils/statusCodes";

export class SongController {
  songService: SongService;

  constructor() {
    this.songService = new SongService();
  }

  // If query params are provided, the following fuction will filter albums, otherwise it will return all
  getSongs = async (request: Request, response: Response) => {
    const band = request.query.band as string;
    const album = request.query.album as string;

    const songFilter = new SongFilter(band, album);

    const songs = await this.songService.getSongs(songFilter);

    if (songs.length > 0) {
      return response.status(statusCodes.SUCCESS).json(songs);
    }

    return response.status(statusCodes.NOT_FOUND).json({
      error: "No songs were found for the parameters provided",
    });
  };
}
