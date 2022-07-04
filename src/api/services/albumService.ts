import { AlbumRepository } from "../repositories/albumRepository";
import { Album } from "../models/album";
import { AlbumFilter } from "../models/filters/albumFilter";

export class AlbumService {
  albumRepository: AlbumRepository;
  constructor() {
    this.albumRepository = new AlbumRepository();
  }

  getAlbums = async (filter: AlbumFilter): Promise<Album[]> => {
    return await this.albumRepository.getAlbums(filter);
  };

  getAlbumById = async (id: number): Promise<Album | null> => {
    return this.albumRepository.getAlbumsById(id);
  };
}
