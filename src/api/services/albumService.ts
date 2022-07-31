import { AlbumRepository } from "../repositories/albumRepository";
import { Album } from "../models/album";
import { AlbumFilter } from "../models/filters/albumFilter";
import { Request } from "express";

export class AlbumService {
  albumRepository: AlbumRepository;
  constructor() {
    this.albumRepository = new AlbumRepository();
  }

  getAlbums = async (filter: AlbumFilter): Promise<Album[]> => {
    return await this.albumRepository.getAlbums(filter);
  };

  getAlbumById = async (id: number): Promise<Album | null> => {
    return await this.albumRepository.getAlbumsById(id);
  };

  createAlbum = async (request: Request): Promise<Album> | never => {
    const album: Album | null = await Album.findOne({
      where: { name: request.body.name },
    });

    if (album) {
      throw new Error("An album with that name already exists");
    }

    return await Album.create(request.body);
  };
}
