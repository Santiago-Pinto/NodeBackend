import { AlbumRepository } from "../repositories/albumRepository";
import { Album } from "../models/album";

export class AlbumService {
  albumRepository: AlbumRepository;
  constructor() {
    this.albumRepository = new AlbumRepository();
  }

  getAlbums = (from?: number, to?: number): Album[] => {
    return this.albumRepository.getAlbums(from, to);
  };

  getAlbumById = (id: number): Album | undefined => {
    return this.albumRepository.getAlbumsById(id);
  };
}
