import supertest from "supertest";
import { describe, test, expect } from "@jest/globals";
import app from "../../../index";
import { Album } from "../../../api/models/album";
import { Song } from "../../../api/models/song";
import db from "../../../api/config/db";

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

describe("Song Controller Tests", () => {
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
    highestSongId = songCreationResponse.albumId;
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
});
