import { Album } from "../models/album";
import { AlbumFilter } from "../models/filters/albumFilter";
import { Op } from "sequelize";
import { DynamicObject } from "../utils/types";
import { NotFoundException } from "../models/exceptions/NotFoundException";
import { BadRequestException } from "../models/exceptions/BadRequestException";

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
    const albums = await Album.findAll({
      where: queryFilter,
    });
    return albums;
  };

  getAlbumById = async (id: number): Promise<Album | null> => {
    const album = await Album.findByPk(id);

    if (album) {
      return album;
    }
    throw new NotFoundException("Album not found");
  };

  createAlbum = async (params: Omit<Album, "id">): Promise<Album> => {
    const album = await Album.findOne({
      where: { name: params.name, band: params.band },
    });

    if (album) {
      throw new BadRequestException(
        "An album with that name for that band already exists"
      );
    }

    return await Album.create(params);
  };

  updateAlbum = async (
    params: Omit<Album, "id">,
    id: number
  ): Promise<Album> => {
    const album = await this.getAlbumById(id);

    if (!album) {
      throw new NotFoundException("Album not found");
    }

    const duplicatedAlbum = await Album.findOne({
      where: { name: params.name, band: params.band },
    });

    if (duplicatedAlbum) {
      throw new BadRequestException(
        "An album with that name for that band already exists"
      );
    }

    return await album.update({ id: id, ...params });
  };

  deleteAlbum = async (id: number): Promise<void> => {
    const album = await this.getAlbumById(id);

    if (!album) {
      throw new NotFoundException("Album not found");
    }

    await album.destroy();
  };
}
