import express from "express";
import { getPatternByName, getPatterns } from "../controllers/patternsController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getPatterns);
router.get("/:patternName", auth, getPatternByName);

export default router;
