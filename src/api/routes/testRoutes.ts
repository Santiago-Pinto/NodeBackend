import express from "express";
import { root } from "../controllers/testController";

const router = express.Router();

// Here go the test routes that the TestRouter can handle
router.get("/", root);

export { router as TestRouter };
