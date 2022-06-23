import {
  getAlbums as getAlbumsFromYearRange,
  getAlbumsFromId,
} from "../repositories/albumRepository";
import { Album } from "../models/album";

export const getAlbums = (from?: number, to?: number): Album[] => {
  return getAlbumsFromYearRange(from, to);
};

//This function should not return undefined, but since we don't have exception yet, we just handle it this way
export const getAlbumById = (id: number): Album | undefined => {
  return getAlbumsFromId(id);
};
