import supertest from "supertest";
import { describe, test, expect } from "@jest/globals";
import app from "../../../index";
import { Album } from "../../../api/models/album";
import db from "../../../api/config/db";

const testAlbums = [
  { name: "Test Album", year: 1987, band: "Test Band" },
  { name: "Test Album 2", year: 2005, band: "Test Band" },
  { name: "Test Album 3", year: 1995, band: "Another Band" },
];

let highestAlbumId: number;

describe("Album Controller Tests", () => {
  beforeEach(async () => {
    let response: any;
    for (const album of testAlbums) {
      response = await Album.create(album);
    }
    highestAlbumId = response.id;
  });

  afterEach(async () => {
    await Album.destroy({ truncate: true });
  });

  afterAll(async () => {
    await db.connection.close();
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

    test("Should return albums released up to the 'to' filter", async () => {
      const response = await supertest(app).get("/album?to=1994");
      expect(response.body).toHaveLength(1);
      expect(response.statusCode).toEqual(200);

      const filteredAlbums: Album[] = response.body;

      filteredAlbums.forEach((album) => {
        expect(album.year).toBeLessThanOrEqual(1994);
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
      expect(response.body.error).toBe("Album not found");
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

  describe("POST album/", () => {
    test("Should return error if the request has no body", async () => {
      const response = await supertest(app).post(`/album`);
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBe("Invalid request, missing request body");
    });
    test("Should return error if the album has no name", async () => {
      const albumWithNoName = {
        year: 1987,
        band: "Test Band",
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
        band: "Test Band",
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
        name: "Test Album",
        year: 1987,
        band: "Test Band",
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
        band: "Another Band",
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

    test("Should return error if the album has no name", async () => {
      const albumWithNoName = {
        year: 1987,
        band: "Test Band",
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
        band: "Test Band",
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
        .send({ ...updatedAlbum, name: "Test Album", band: "Test Band" });
      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual(
        "An album with that name for that band already exists"
      );
    });

    test("Should succeed if a band changes an albums name for another that already exists for another band", async () => {
      const response = await supertest(app)
        .put(`/album/${highestAlbumId}`)
        .send({ ...updatedAlbum, name: "Test Album", band: "Another Band" });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        id: highestAlbumId,
        ...updatedAlbum,
        name: "Test Album",
        band: "Another Band",
      });
    });

    test("Should return the new values if succeeded", async () => {
      const response = await supertest(app)
        .put(`/album/${highestAlbumId}`)
        .send(updatedAlbum);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ id: highestAlbumId, ...updatedAlbum });
    });
  });

  describe("DELETE album/{id}", () => {
    test("Should return error if there is no album for the given id", async () => {
      const response = await supertest(app).delete(
        `/album/${highestAlbumId + 1}`
      );
      expect(response.statusCode).toEqual(404);
      expect(response.body.error).toBe("Album not found");
    });

    test("Should return status code of 200 if succeeded", async () => {
      const response = await supertest(app).delete(`/album/${highestAlbumId}`);
      expect(response.statusCode).toEqual(200);

      const allAlbums = await Album.findAll();
      expect(allAlbums.length).toEqual(2);
    });
  });
});
