import supertest from "supertest";
import { describe, test, expect } from "@jest/globals";
import app from "../../index";
import { Album } from "../../api/models/album";
import { Song } from "../../api/models/song";
import db from "../../api/config/db";

const testAlbums = [
  { name: "Album 1", year: 1987, band: "Band A" },
  { name: "Album 2", year: 1989, band: "Band B" },
];

const testSongs = [
  {
    name: "Song 1",
  },
  {
    name: "Song 2",
  },
  {
    name: "Song 3",
  },
  {
    name: "Song 4",
  },
  {
    name: "Song 5",
  },
];

let highestAlbumId: number;
let highestSongId: number;

describe("Song Endpoints Tests", () => {
  beforeEach(async () => {
    let albumCreationResponse: any;
    let songCreationResponse: any;

    for (const album of testAlbums) {
      albumCreationResponse = await Album.create(album);
    }
    highestAlbumId = albumCreationResponse.id;

    for (let i = 0; i < testSongs.length; ++i) {
      if (i < 2) {
        await Song.create({
          ...testSongs[i],
          albumId: highestAlbumId,
        });
      } else {
        songCreationResponse = await Song.create({
          ...testSongs[i],
          albumId: highestAlbumId - 1,
        });
      }
    }
    highestSongId = songCreationResponse.id;
  });

  afterEach(async () => {
    await Album.destroy({ truncate: true });
    await Song.destroy({ truncate: true });
  });

  afterAll(async () => {
    await db.connection.close();
  });

  describe("GET song/", () => {
    test("Should return all songs when filters are not set", async () => {
      const response = await supertest(app).get("/song");
      expect(response.body).toHaveLength(testSongs.length);
      expect(response.statusCode).toEqual(200);
    });

    test("Should return songs filtered based on band", async () => {
      const response = await supertest(app).get("/song?band=Band B");
      expect(response.body).toHaveLength(2);
      expect(response.statusCode).toEqual(200);

      const filteredSong: Song = response.body[0];
      expect(filteredSong.albumId.toString()).toBe(highestAlbumId);
    });

    test("Should return songs filtered based on Album", async () => {
      const response = await supertest(app).get("/song?album=Album 1");
      expect(response.body).toHaveLength(3);
      expect(response.statusCode).toEqual(200);

      const filteredSong: Song & { album: Pick<Album, "band" | "name"> } =
        response.body[0];
      expect(filteredSong.album.name).toBe("Album 1");
    });

    test("Should return 404 if no songs are found for a nonexisting band", async () => {
      const response = await supertest(app).get("/song?band=nonexistent band");
      expect(response.statusCode).toEqual(404);
    });

    test("Should return 404 if no songs are found for a nonexisting album", async () => {
      const response = await supertest(app).get(
        "/song?album=nonexistent album"
      );
      expect(response.statusCode).toEqual(404);
    });

    test("Should return 404 if no songs are found for a given filter combination", async () => {
      const response = await supertest(app).get(
        `/song?album=nonexistent album&band=nonexistent band}`
      );
      expect(response.statusCode).toEqual(404);
    });
  });

  describe("POST song/", () => {
    test("Should create a new song if all fields are correct", async () => {
      const newSong = { name: "new song", albumId: Number(highestAlbumId) };
      const response = await supertest(app).post("/song").send(newSong);

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({ ...response.body, ...newSong });
    });

    test("Should return not found if the albumId doesn't match any existing album", async () => {
      const newSong = { name: "new song", albumId: Number(highestAlbumId + 1) };
      const response = await supertest(app).post("/song").send(newSong);

      expect(response.statusCode).toEqual(404);
      expect(response.body.error).toEqual("Album not found");
    });

    test("Should fail if the request has no body", async () => {
      const response = await supertest(app).post("/song");

      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual(
        "Invalid request, missing request body"
      );
    });

    test("Should fail if no song name is specified", async () => {
      const newSong = { albumId: Number(highestAlbumId) };
      const response = await supertest(app).post("/song").send(newSong);

      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual("A song must have a name");
    });

    test("Should fail if no albumId is specified", async () => {
      const newSong = { name: "new song" };
      const response = await supertest(app).post("/song").send(newSong);

      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual("A song must have an album");
    });
  });

  describe("PUT song/{id}", () => {
    test("Should update a song if all fields are correct", async () => {
      const newSongData = {
        name: "new song name",
        albumId: Number(highestAlbumId),
      };
      const response = await supertest(app)
        .put(`/song/${highestSongId}`)
        .send(newSongData);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ ...response.body, ...newSongData });
    });

    test("Should update a song if only a name is provided", async () => {
      const newSongData = {
        name: "new song name",
      };
      const response = await supertest(app)
        .put(`/song/${highestSongId}`)
        .send(newSongData);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ ...response.body, ...newSongData });
    });

    test("Should update a song if only an albumId is provided", async () => {
      const newSongData = {
        albumId: Number(highestAlbumId),
      };
      const response = await supertest(app)
        .put(`/song/${highestSongId}`)
        .send(newSongData);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ ...response.body, ...newSongData });
    });

    test("Should fail if the albumId provided doesn't match with any existing album", async () => {
      const newSongData = {
        albumId: Number(highestAlbumId + 1),
      };
      const response = await supertest(app)
        .put(`/song/${highestSongId}`)
        .send(newSongData);

      expect(response.statusCode).toEqual(404);
      expect(response.body.error).toEqual("Album not found");
    });

    test("Should fail if the song id provided doesn't match with any existing song", async () => {
      const newSongData = {
        name: "new song name",
        albumId: Number(highestAlbumId),
      };
      const response = await supertest(app)
        .put(`/song/${highestSongId + 1}`)
        .send(newSongData);

      expect(response.statusCode).toEqual(404);
      expect(response.body.error).toEqual("Song not found");
    });

    test("Should fail if the request has no body", async () => {
      const response = await supertest(app).put(`/song/${highestSongId}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toEqual(
        "Invalid request, missing request body"
      );
    });
  });

  describe("DELETE song/{id}", () => {
    test("Song should be deleted if a valid id is passed", async () => {
      const response = await supertest(app).delete(`/song/${highestSongId}`);

      const songs = await Song.findAll();
      expect(response.statusCode).toEqual(200);
      expect(songs.length).toEqual(testSongs.length - 1);
    });

    test("Should throw error if the id is not valid", async () => {
      const response = await supertest(app).delete(
        `/song/${highestSongId + 1}`
      );

      expect(response.statusCode).toEqual(404);
      expect(response.body.error).toEqual("Song not found");
    });
  });
});
