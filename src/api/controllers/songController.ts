import { Request, Response } from "express";
import { BadRequestException } from "../models/exceptions/BadRequestException";
import { NotFoundException } from "../models/exceptions/NotFoundException";
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

  createSong = async (request: Request, response: Response) => {
    const validationResult = validateSongData(request);

    if (validateSongData(request)) {
      return response.status(statusCodes.BAD_REQUEST).json({
        error: validationResult,
      });
    }

    const songName = request.body.name as string;
    const albumId = parseInt(request.body.albumId as string);

    try {
      const result = await this.songService.createSong(songName, albumId);
      return response.status(statusCodes.CREATED).json(result);
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        return response
          .status(statusCodes.BAD_REQUEST)
          .json({ error: error.message });
      }

      if (error instanceof NotFoundException) {
        return response
          .status(statusCodes.NOT_FOUND)
          .json({ error: error.message });
      }
      return response
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  };
}

const validateSongData = (request: Request) => {
  const songData = request.body;
  if (!Object.keys(songData).length) {
    return "Invalid request, missing request body";
  }
  if (!songData.name) {
    return "A song must have a name";
  }

  if (!songData.albumId) {
    return "A song must have an album";
  }
};
