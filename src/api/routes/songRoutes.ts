import express from "express";
import { SongController } from "../controllers/songController";

const router = express.Router();
const songController = new SongController();

// Here go the routes that the router will handle
router.get("/", songController.getSongs);
router.post("/", songController.createSong);
router.patch("/:id", songController.updateSong);
router.delete("/:id", songController.deleteSong);

export { router as SongRouter };
