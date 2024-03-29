import supertest from "supertest";
import { describe, test, expect } from "@jest/globals";
import app from "../../index";
import { Album } from "../../api/models/album";
import db from "../../api/config/db";
import { Song } from "../../api/models/song";

const testAlbums = [
  { name: "Album 1", year: 1987, band: "Band A" },
  { name: "Album 2", year: 1989, band: "Band A" },
  { name: "Album 3", year: 1994, band: "Band A" },
  { name: "Album 4", year: 1997, band: "Band A" },
  { name: "Album 5", year: 2000, band: "Band A" },
  { name: "Album 6", year: 1990, band: "Band B" },
  { name: "Album 7", year: 1995, band: "Band B" },
  { name: "Album 8", year: 1998, band: "Band B" },
  { name: "Album 9", year: 2001, band: "Band C" },
  { name: "Album 10", year: 2008, band: "Band C" },
];

const setupTest = async () => {
  let response: any;
  for (const album of testAlbums) {
    response = await Album.create(album);
  }
  return response;
};

describe("Album Endpoints Tests", () => {
  afterAll(async () => {
    await Album.destroy({ truncate: true });
    await Song.destroy({ truncate: true });
    await db.connection.close();
  });

  describe("GET album/", () => {
    let highestAlbumId: number;
    beforeAll(async () => {
      const response = await setupTest();
      highestAlbumId = response.id;
    });

    afterAll(async () => {
      await Album.destroy({ truncate: true });
    });

    test("Should return all albums when filters are not set", async () => {
      const response = await supertest(app).get("/album");
      expect(response.body).toHaveLength(testAlbums.length);
      expect(response.statusCode).toEqual(200);
    });

    test("Should return albums filtered based on band", async () => {
      const response = await supertest(app).get("/album?band=Band B");
      expect(response.body).toHaveLength(3);
      expect(response.statusCode).toEqual(200);

      const filteredAlbum: Album = response.body[0];
      expect(filteredAlbum.band).toBe("Band B");
    });

    test("Should return albums released after the 'from' filter", async () => {
      const response = await supertest(app).get("/album?from=1994");
      expect(response.body).toHaveLength(7);
      expect(response.statusCode).toEqual(200);

      const filteredAlbums: Album[] = response.body;

      filteredAlbums.forEach((album) => {
        expect(album.year).toBeGreaterThanOrEqual(1994);
      });
    });

    test("Should return albums released up to the 'to' filter", async () => {
      const response = await supertest(app).get("/album?to=1994");
      expect(response.body).toHaveLength(4);
      expect(response.statusCode).toEqual(200);

      const filteredAlbums: Album[] = response.body;

      filteredAlbums.forEach((album) => {
        expect(album.year).toBeLessThanOrEqual(1994);
      });
    });

    test("Should return albums between 'from' and 'to' filters", async () => {
      const from = 1990;
      const to = 2000;
      const response = await supertest(app).get(`/album?from=${from}&to=${to}`);
      expect(response.body).toHaveLength(6);
      expect(response.statusCode).toEqual(200);

      const filteredAlbums: Album[] = response.body;

      filteredAlbums.forEach((album) => {
        expect(album.year).toBeLessThanOrEqual(to);
        expect(album.year).toBeGreaterThanOrEqual(from);
      });
    });

    test("Should return albums between 'from' and 'to' filters and with the band specified on the filter", async () => {
      const from = 1990;
      const to = 1999;
      const band = "Band A";
      const response = await supertest(app).get(
        `/album?from=${from}&to=${to}&band=${band}`
      );
      expect(response.body).toHaveLength(2);
      expect(response.statusCode).toEqual(200);

      const filteredAlbums: Album[] = response.body;

      filteredAlbums.forEach((album) => {
        expect(album.year).toBeLessThanOrEqual(to);
        expect(album.year).toBeGreaterThanOrEqual(from);
        expect(album.band).toBe(band);
      });
    });

    test("Should return error if from is higher than to", async () => {
      const from = 1980;
      const to = 1970;
      const response = await supertest(app).get(`/album?from=${from}&to=${to}`);
      expect(response.statusCode).toEqual(400);
    });

    test("Should return 404 if no albums are found for a combination of date filters", async () => {
      const from = 1970;
      const to = 1980;
      const response = await supertest(app).get(`/album?from=${from}&to=${to}`);
      expect(response.statusCode).toEqual(404);
    });

    test("Should return 404 if no albums are found for a nonexisting band", async () => {
      const response = await supertest(app).get("/album?band=nonexistent band");
      expect(response.statusCode).toEqual(404);
    });

    test("Should return 404 if no albums are found for a given filter combination", async () => {
      const from = 1970;
      const to = 2010;
      const response = await supertest(app).get(
        `/album?from=${from}&to=${to}&band=nonexistent band}`
      );
      expect(response.statusCode).toEqual(404);
    });
  });

  describe("GET album/{id}", () => {
    let highestAlbumId: number;
    beforeAll(async () => {
      const response = await setupTest();
      highestAlbumId = response.id;
    });

    afterAll(async () => {
      await Album.destroy({ truncate: true });
    });

    test("Should return status code of 404 if no album is found", async () => {
      //Since highestAlbumId grants no other album was created after, i just simply increase it by one to force a nonexisting id
      const response = await supertest(app).get(`/album/${highestAlbumId + 1}`);
      expect(response.body.error).toBe("Album not found");
      expect(response.statusCode).toEqual(404);
    });

    test("Should return status code of 200 if an album is found", async () => {
      const response = await supertest(app).get(`/album/${highestAlbumId}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body.name).toEqual(
        testAlbums[testAlbums.length - 1].name
      );
      expect(response.body.year).toEqual(
        testAlbums[testAlbums.length - 1].year
      );
      expect(response.body.band).toEqual(
        testAlbums[testAlbums.length - 1].band
      );
    });
  });

  describe("POST album/", () => {
    let highestAlbumId: number;
    beforeAll(async () => {
      const response = await setupTest();
      highestAlbumId = response.id;
    });

    afterAll(async () => {
      await Album.destroy({ truncate: true });
    });

    test("Should return error if the request has no body", async () => {
      const response = await supertest(app).post(`/album`);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBe("Invalid request, missing request body");
    });
    test("Should return error if the album has no name", async () => {
      const albumWithNoName = {
        year: 1987,
        band: "Band A",
      };
      const response = await supertest(app)
        .post(`/album`)
        .send(albumWithNoName);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual("An album must have a name");
    });

    test("Should return error if the album has no release year", async () => {
      const albumWithNoYear = {
        name: "New Album",
        band: "Band A",
      };
      const response = await supertest(app)
        .post(`/album`)
        .send(albumWithNoYear);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual("An album must have a release year");
    });

    test("Should return error if the album has no band", async () => {
      const albumWithNoBand = {
        name: "New Album",
        year: 1987,
      };
      const response = await supertest(app)
        .post(`/album`)
        .send(albumWithNoBand);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual(
        "An album must have a band associated"
      );
    });

    test("Should return error if an album with the same name for the given band already exists", async () => {
      const albumWithDuplicatedName = {
        name: "Album 3",
        year: 1987,
        band: "Band A",
      };
      const response = await supertest(app)
        .post(`/album`)
        .send(albumWithDuplicatedName);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual(
        "An album with that name for that band already exists"
      );
    });

    test("Should return status code of 201 if an album with an existing name but for a different band is created", async () => {
      const newAlbum = {
        name: "Test Album",
        year: 1987,
        band: "Band B",
      };
      const response = await supertest(app).post(`/album`).send(newAlbum);
      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({ ...response.body, ...newAlbum });
    });

    test("Should return status code of 201 if an album is created", async () => {
      const newAlbum = {
        name: "New Album",
        year: 1987,
        band: "New Band",
      };
      const response = await supertest(app).post(`/album`).send(newAlbum);
      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({ ...response.body, ...newAlbum });
    });
  });

  describe("PUT album/{id}", () => {
    let highestAlbumId: number;
    beforeAll(async () => {
      const response = await setupTest();
      highestAlbumId = response.id;
    });

    afterAll(async () => {
      await Album.destroy({ truncate: true });
    });

    const updatedAlbum = {
      name: "New Album name",
      year: 1990,
      band: "New Band name",
    };

    test("Should return error if the request has no body", async () => {
      const response = await supertest(app).put(`/album/${highestAlbumId}`);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBe("Invalid request, missing request body");
    });

    test("Should return error if there is no album for the given id", async () => {
      const response = await supertest(app)
        .put(`/album/${highestAlbumId + 1}`)
        .send(updatedAlbum);
      expect(response.statusCode).toEqual(404);
      expect(response.body.error).toBe("Album not found");
    });

    test("Should allow to only update the name", async () => {
      const albumWithNoName = {
        year: 1987,
        band: "Band A",
      };
      const response = await supertest(app)
        .put(`/album/${highestAlbumId}`)
        .send(albumWithNoName);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual("An album must have a name");
    });

    test("Should return error if the album has no release year", async () => {
      const albumWithNoYear = {
        name: "New Album",
        band: "Band A",
      };
      const response = await supertest(app)
        .put(`/album/${highestAlbumId}`)
        .send(albumWithNoYear);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual("An album must have a release year");
    });

    test("Should return error if the album has no band", async () => {
      const albumWithNoBand = {
        name: "New Album",
        year: 1987,
      };
      const response = await supertest(app)
        .put(`/album/${highestAlbumId}`)
        .send(albumWithNoBand);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual(
        "An album must have a band associated"
      );
    });

    test("Should return error if the new album name exists for the given band", async () => {
      const response = await supertest(app)
        .put(`/album/${highestAlbumId}`)
        .send({ ...updatedAlbum, name: "Album 4", band: "Band A" });
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual(
        "An album with that name for that band already exists"
      );
    });

    test("Should succeed if a band changes an albums name for another that already exists for another band", async () => {
      const response = await supertest(app)
        .put(`/album/${highestAlbumId}`)
        .send({ ...updatedAlbum, name: "Test Album", band: "Band B" });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        ...response.body,
        id: highestAlbumId,
        ...updatedAlbum,
        name: "Test Album",
        band: "Band B",
      });
    });

    test("Should return the new values if succeeded", async () => {
      const response = await supertest(app)
        .put(`/album/${highestAlbumId}`)
        .send(updatedAlbum);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        id: highestAlbumId,
        ...response.body,
        ...updatedAlbum,
      });
    });
  });

  describe("DELETE album/{id}", () => {
    let highestAlbumId: number;
    beforeAll(async () => {
      const response = await setupTest();
      highestAlbumId = response.id;
    });

    afterAll(async () => {
      await Album.destroy({ truncate: true });
    });
    test("Should return error if there is no album for the given id", async () => {
      const response = await supertest(app).delete(
        `/album/${highestAlbumId + 1}`
      );
      expect(response.statusCode).toEqual(404);
      expect(response.body.error).toBe("Album not found");
    });

    test("Should return status code of 200 if succeeded", async () => {
      for (let i = 0; i < 2; ++i) {
        await Song.create({ albumId: highestAlbumId, name: "testSong" });
      }

      await Song.create({ albumId: highestAlbumId - 1, name: "testSong" }); // This one won't get deleted

      const response = await supertest(app).delete(`/album/${highestAlbumId}`);
      expect(response.statusCode).toEqual(200);

      const allAlbums = await Album.findAll();
      expect(allAlbums.length).toEqual(testAlbums.length - 1);

      const allSongs = await Song.findAll();
      expect(allSongs.length).toEqual(1);

      const songsFromDeletedAlbum = await Song.findAll({
        where: { albumId: highestAlbumId },
      });
      expect(songsFromDeletedAlbum.length).toEqual(0); // Testing delete on cascade
    });
  });
});
