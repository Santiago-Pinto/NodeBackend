import { Op } from "sequelize";
import { Album } from "../models/album";
import { NotFoundException } from "../models/exceptions/NotFoundException";
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

  createSong = async (name: string, albumId: number): Promise<Song> => {
    const queryFilter: DynamicObject = {};

    queryFilter.albumId = { [Op.eq]: albumId };

    const songAlbum = await Song.findOne({ where: queryFilter });

    if (!songAlbum) {
      throw new NotFoundException("Album not found");
    }

    return Song.create({ name, albumId });
  };

  updateSong = async (params: Omit<Song, "id">, id: number): Promise<Song> => {
    const song = await Song.findByPk(id);

    if (!song) {
      throw new NotFoundException("Song not found");
    }

    if (params.albumId) {
      const songAlbum = await Album.findByPk(params.albumId);

      if (!songAlbum) {
        throw new NotFoundException("Album not found");
      }
    }

    return await song.update({ id: id, ...params });
  };

  deleteSong = async (id: number) => {
    const song = await Song.findByPk(id);

    if (!song) {
      throw new NotFoundException("Song not found");
    }

    await song.destroy();
  };
}
