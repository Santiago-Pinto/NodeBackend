import express from "express";
import { AlbumController } from "../controllers/albumController";

const router = express.Router();
const albumController = new AlbumController();

// Here go the routes that the AlbumRouter will handle
router.get("/", albumController.getAlbums);
router.get("/:id", albumController.getAlbumById);
router.post("/", albumController.createAlbum);
router.put("/:id", albumController.updateAlbum);
router.delete("/:id", albumController.deleteAlbum);

export { router as AlbumRouter };
