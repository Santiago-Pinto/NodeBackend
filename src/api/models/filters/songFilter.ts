export class SongFilter {
  filter: {
    band?: string;
    album?: string;
  };

  constructor(band?: string, album?: string) {
    this.filter = {};
    if (band) {
      this.filter.band = band;
    }

    if (album) {
      this.filter.album = album;
    }
  }

  getFilter = () => {
    return this.filter;
  };
}
