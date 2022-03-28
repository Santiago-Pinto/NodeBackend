import express from "express";
import { getAlbums, getAlbumById } from "../controllers/albumController";

const router = express.Router();

// Here go the routes that the AlbumRouter will handle
router.get("/", getAlbums);
router.get("/:id", getAlbumById);

export { router as AlbumRouter };
