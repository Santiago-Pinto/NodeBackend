import { Op } from "sequelize";
import { Album } from "../models/album";
import { SongFilter } from "../models/filters/songFilter";
import { Song } from "../models/song";
import { DynamicObject } from "../utils/types";

export class SongService {
  getSongs = async (filter: SongFilter): Promise<Song[]> => {
    const { band, album } = filter.getFilter();
    const queryFilter: DynamicObject = {};

    if (band) {
      queryFilter.band = {
        [Op.iLike]: `%${band}%`,
      };
    }

    if (album) {
      queryFilter.name = {
        [Op.iLike]: `%${album}%`,
      };
    }

    const songs = await Song.findAll({
      include: {
        model: Album,
        as: "album",
        where: queryFilter,
        attributes: ["name", "year"], // These are the fields that we want to keep from the right side table of the join (In this case Album)
      },
    });

    return songs;
  };
}
