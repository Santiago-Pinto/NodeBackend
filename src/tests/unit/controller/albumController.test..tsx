import supertest from "supertest";
import { describe, test, expect } from "@jest/globals";
import app from "../../../index";
import { Sequelize } from "sequelize";
import { config } from "../../../api/config/config";
import { Album } from "../../../api/models/album";

let sequelize: Sequelize;

const connectDB = async () => {
  sequelize = new Sequelize(config.DB_URI, { logging: false });
  try {
    await sequelize.authenticate();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Unable to connect to the database:", error);
  }
};

const testAlbums = [
  { name: "Test Album", year: 1987, band: "Test Band" },
  { name: "Test Album 2", year: 2005, band: "Test Band" },
  { name: "Test Album 3", year: 1995, band: "Another Band" },
];

let highestAlbumId: number;

describe("Album Controller Tests", () => {
  beforeEach(async () => {
    await connectDB();
    // To Do: Find a way to use forEach instead of this. I tried, but some async issues are occuring.
    await Album.create(testAlbums[0]);
    await Album.create(testAlbums[1]);
    const response = await Album.create(testAlbums[2]);

    highestAlbumId = response.id;
  });

  afterEach(async () => {
    await Album.destroy({ truncate: true });
    await sequelize.close();
  });

  describe("GET album/", () => {
    test("Should return status code of 200 if no filters are set", async () => {
      const response = await supertest(app).get("/album");
      expect(response.statusCode).toEqual(200);
    });

    test("Should return all albums when filters are not set", async () => {
      const response = await supertest(app).get("/album");
      expect(response.body).toHaveLength(testAlbums.length);
      expect(response.statusCode).toEqual(200);
    });

    test("Should return albums filtered based on band", async () => {
      const response = await supertest(app).get("/album?band=Another Band");
      expect(response.body).toHaveLength(1);
      expect(response.statusCode).toEqual(200);

      const filteredAlbum: Album = response.body[0];
      expect(filteredAlbum.name).toBe("Test Album 3");
      expect(filteredAlbum.year).toBe(1995);
      expect(filteredAlbum.band).toBe("Another Band");
    });

    test("Should return albums released after the 'from' filter", async () => {
      const response = await supertest(app).get("/album?from=1994");
      expect(response.body).toHaveLength(2);
      expect(response.statusCode).toEqual(200);

      const filteredAlbums: Album[] = response.body;

      filteredAlbums.forEach((album) => {
        expect(album.year).toBeGreaterThanOrEqual(1994);
      });
    });

    test("Should return albums between 'from' and 'to' filters", async () => {
      const from = 1980;
      const to = 2000;
      const response = await supertest(app).get(`/album?from=${from}&to=${to}`);
      expect(response.body).toHaveLength(2);
      expect(response.statusCode).toEqual(200);

      const filteredAlbums: Album[] = response.body;

      filteredAlbums.forEach((album) => {
        expect(album.year).toBeLessThanOrEqual(to);
        expect(album.year).toBeGreaterThanOrEqual(from);
      });
    });

    test("Should return albums between 'from' and 'to' filters and with the band specified on the filter", async () => {
      const from = 1980;
      const to = 2000;
      const band = "Test Band";
      const response = await supertest(app).get(
        `/album?from=${from}&to=${to}&band=${band}`
      );
      expect(response.body).toHaveLength(1);
      expect(response.statusCode).toEqual(200);

      const filteredAlbums: Album[] = response.body;

      filteredAlbums.forEach((album) => {
        expect(album.year).toBeLessThanOrEqual(to);
        expect(album.year).toBeGreaterThanOrEqual(from);
        expect(album.band).toBe(band);
        expect(album.name).toBe("Test Album");
      });
    });

    test("Should return error if from is higher than to", async () => {
      const from = 1980;
      const to = 1970;
      const response = await supertest(app).get(`/album?from=${from}&to=${to}`);
      expect(response.statusCode).toEqual(400);
    });

    test("Should return 404 if no bands are found for a combination of date filters", async () => {
      const from = 1970;
      const to = 1980;
      const response = await supertest(app).get(`/album?from=${from}&to=${to}`);
      expect(response.statusCode).toEqual(404);
    });

    test("Should return 404 if no bands are found for a nonexisting band", async () => {
      const response = await supertest(app).get("/album?band=nonexistent band");
      expect(response.statusCode).toEqual(404);
    });

    test("Should return 404 if no bands are found for a given filter combination", async () => {
      const from = 1970;
      const to = 2010;
      const response = await supertest(app).get(
        `/album?from=${from}&to=${to}&band=nonexistent band}`
      );
      expect(response.statusCode).toEqual(404);
    });
  });

  describe("GET album/{id}", () => {
    test("Should return status code of 404 if no album is found", async () => {
      //Since highestAlbumId grants no other album was created after, i just simply increase it by one to force a nonexisting id
      const response = await supertest(app).get(`/album/${++highestAlbumId}`);
      expect(response.statusCode).toEqual(404);
    });

    test("Should return status code of 200 if an album is found", async () => {
      const response = await supertest(app).get(`/album/${highestAlbumId}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body.name).toEqual(testAlbums[2].name);
      expect(response.body.year).toEqual(testAlbums[2].year);
      expect(response.body.band).toEqual(testAlbums[2].band);
    });
  });
});
