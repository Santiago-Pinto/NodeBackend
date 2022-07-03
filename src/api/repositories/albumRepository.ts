import { Album } from "../models/album";
import { AlbumFilter } from "../models/filters/albumFilter";

export class AlbumRepository {
  //Here will go the queries to the data base in the future
  getAlbums = async (filter: AlbumFilter): Promise<Album[]> => {
    let result: Album[] = [];
    const from = filter.getFilter().from;
    const to = filter.getFilter().to;
    let albums = await Album.findAll();
    if (from && to) {
      albums = albums.filter((album) => {
        return album.year >= from && album.year <= to;
      });
    } else {
      albums = albums;
    }
    return albums;
  };

  getAlbumsById = (id: number): Album | undefined => {
    return undefined;
    //return albums.find((album) => album.id === id);
  };
}
