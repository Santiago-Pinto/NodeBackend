import { Album } from "../models/album";
import { AlbumFilter } from "../models/filters/albumFilter";
const albums = [
  { id: 1, name: "When Day and Dream Unite", year: 1989 },
  { id: 2, name: "Images and Words", year: 1992 },
  { id: 3, name: "Awake", year: 1994 },
  { id: 4, name: "Falling into Infinity", year: 1997 },
  { id: 5, name: "Metropolis Pt 2: Scenes From a Memory", year: 1999 },
  { id: 6, name: "Six Degrees of Inner Turbulence", year: 2002 },
  { id: 7, name: "Train of Thought", year: 2003 },
  { id: 8, name: "Octavarium", year: 2005 },
  { id: 9, name: "Systematic Chaos", year: 2007 },
  { id: 10, name: "Black Clouds & Silver Linings", year: 2009 },
];

export class AlbumRepository {
  //Here will go the queries to the data base in the future
  getAlbums = (filter: AlbumFilter): Album[] => {
    let result: Album[] = [];
    const from = filter.getFilter().from;
    const to = filter.getFilter().to;

    if (from && to) {
      result = albums.filter((album) => {
        return album.year >= from && album.year <= to;
      });
    } else {
      result = albums;
    }
    return result;
  };

  getAlbumsById = (id: number): Album | undefined => {
    return albums.find((album) => album.id === id);
  };
}
