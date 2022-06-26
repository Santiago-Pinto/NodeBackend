import { AlbumRepository } from "../repositories/albumRepository";
import { Album } from "../models/album";
import { AlbumFilter } from "../models/filters/albumFilter";

export class AlbumService {
  albumRepository: AlbumRepository;
  constructor() {
    this.albumRepository = new AlbumRepository();
  }

  getAlbums = (filter: AlbumFilter): Album[] => {
    return this.albumRepository.getAlbums(filter);
  };

  getAlbumById = (id: number): Album | undefined => {
    return this.albumRepository.getAlbumsById(id);
  };
}
