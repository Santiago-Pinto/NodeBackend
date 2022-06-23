import express from "express";
import { AlbumController } from "../controllers/albumController";

const router = express.Router();
const albumController = new AlbumController();

// Here go the routes that the AlbumRouter will handle
router.get("/", albumController.getAlbums);
router.get("/:id", albumController.getAlbumById);

export { router as AlbumRouter };
