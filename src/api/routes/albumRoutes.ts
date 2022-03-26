import express from "express";
import { getAllAlbums } from "../controllers/albumController";

const router = express.Router();

// Here go the routes that the AlbumRouter will handle
router.get("/", getAllAlbums);

export { router as AlbumRouter };
