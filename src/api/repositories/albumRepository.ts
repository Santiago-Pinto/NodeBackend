import { Album } from "../models/album";
import { AlbumFilter } from "../models/filters/albumFilter";
import { Op } from "sequelize";
import { DynamicObject } from "../utils/types";

export class AlbumRepository {
  //Here will go the queries to the data base in the future
  getAlbums = async (filter: AlbumFilter): Promise<Album[]> => {
    const band = filter.getFilter().band;
    const from = filter.getFilter().from;
    const to = filter.getFilter().to;
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

  getAlbumsById = async (id: number): Promise<Album | null> => {
    return await Album.findByPk(id);
  };
}
