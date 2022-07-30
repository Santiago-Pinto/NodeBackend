export class AlbumFilter {
  filter: {
    band?: string;
    from?: number;
    to?: number;
  };

  constructor(band?: string, from?: number, to?: number) {
    this.filter = {};
    if (band) {
      this.filter.band = band;
    }

    if (from) {
      this.filter.from = from;
    }

    if (to || to && from && to >= from) {
      this.filter.to = to;
    }
  }

  getFilter = () => {
    return this.filter;
  };
}
