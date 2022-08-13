import { Album } from "../models/album";
import { AlbumFilter } from "../models/filters/albumFilter";
import { Request } from "express";
import { Op } from "sequelize";
import { DynamicObject } from "../utils/types";

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
      where: { name: request.body.name },
    });

    if (album) {
      throw "An album with that name already exists";
    }

    return await Album.create(request.body);
  };

  updateAlbum = async (
    request: Request,
    id: number
  ): Promise<Album> | never => {
    const album: Album | null = await this.getAlbumById(id);

    if (!album) {
      throw "Album not found";
    }

    return await album.update({ id: request.body.id, ...request.body });
  };
}
