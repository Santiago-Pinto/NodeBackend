import express from "express";
import { SongController } from "../controllers/songController";

const router = express.Router();
const songController = new SongController();

// Here go the routes that the router will handle
router.get("/", songController.getSongs);
router.post("/", songController.createSong);
router.put("/:id", songController.updateSong);

/*router.get("/:id", songController.getAlbumById);
router.delete("/:id", songController.deleteAlbum);*/

export { router as SongRouter };
