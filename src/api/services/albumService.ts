import { Album } from "../models/album";
import { AlbumFilter } from "../models/filters/albumFilter";
import { Request } from "express";
import { Op } from "sequelize";
import { DynamicObject } from "../utils/types";
import { statusCodes } from "../utils/statusCodes";

export class AlbumService {
  getAlbums = async (filter: AlbumFilter): Promise<Album[]> => {
    const { band, from, to } = filter.getFilter();
    const queryFilter: DynamicObject = {};
    if (band) {
      queryFilter.band = {
        [Op.iLike]: band,
      };
    }

    switch (true) {
      case from && !to:
        queryFilter.year = { [Op.gte]: from };
        break;

      case !from && !!to:
        queryFilter.year = { [Op.lte]: to };
        break;

      case !!from && !!to:
        queryFilter.year = {
          [Op.and]: {
            [Op.gte]: from,
            [Op.lte]: to,
          },
        };
        break;
    }
    const albums: Album[] = await Album.findAll({
      where: queryFilter,
    });
    return albums;
  };

  getAlbumById = async (id: number): Promise<Album | null> => {
    return await Album.findByPk(id);
  };

  createAlbum = async (request: Request): Promise<Album> | never => {
    const album: Album | null = await Album.findOne({
      where: { name: request.body.name, band: request.body.band },
    });

    if (album) {
      throw {
        message: "An album with that name for that band already exists",
        statusCode: statusCodes.BAD_REQUEST,
      };
    }

    return await Album.create(request.body);
  };

  updateAlbum = async (
    request: Request,
    id: number
  ): Promise<Album> | never => {
    const album: Album | null = await this.getAlbumById(id);

    if (!album) {
      throw { message: "Album not found", statusCode: statusCodes.NOT_FOUND };
    }

    const duplicatedAlbum: Album | null = await Album.findOne({
      where: { name: request.body.name, band: request.body.band },
    });

    if (duplicatedAlbum) {
      throw {
        message: "An album with that name for that band already exists",
        statusCode: statusCodes.BAD_REQUEST,
      };
    }

    return await album.update({ id: request.body.id, ...request.body });
  };

  deleteAlbum = async (id: number): Promise<void> | never => {
    const album: Album | null = await this.getAlbumById(id);

    if (!album) {
      throw { message: "Album not found", statusCode: statusCodes.NOT_FOUND };
    }

    await album.destroy();
  };
}
