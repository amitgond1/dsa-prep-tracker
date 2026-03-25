import express from "express";
import { getPlanner, plannerValidation, savePlanner } from "../controllers/plannerController.js";
import auth from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", auth, getPlanner);
router.put("/", auth, plannerValidation, validate, savePlanner);

export default router;
