import { replaceDoubleQuotesWithSingle } from "../../utils/stringParse";

export class AlbumFilter {
  filter: {
    band?: string;
    from?: number;
    to?: number;
  };

  constructor(band?: string, from?: number, to?: number) {
    this.filter = {};
    if (band) {
      this.filter.band = replaceDoubleQuotesWithSingle(band); //Single quotes required because of the SGBD used
    }

    if (from) {
      this.filter.from = from;
    }

    if (to && from && to >= from) {
      this.filter.to = to;
    }
  }

  getFilter = () => {
    return this.filter;
  };
}
