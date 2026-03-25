import express from "express";
import {
  createCustomProblem,
  createCustomProblemValidation,
  deleteCustomProblem,
  getAnalytics,
  getBookmarks,
  getCustomProblems,
  getDashboard,
  getRevisionQueue,
  getUserProblemMap,
  markCustomProblemSolved,
  markProblemSolved,
  markSolvedValidation,
  toggleBookmark,
  updateCustomProblem,
  updateProblemContent,
  updateProblemContentValidation
} from "../controllers/userProblemsController.js";
import auth from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/map", auth, getUserProblemMap);
router.get("/dashboard", auth, getDashboard);
router.get("/revision", auth, getRevisionQueue);
router.get("/analytics", auth, getAnalytics);
router.get("/bookmarks", auth, getBookmarks);

router.post("/:problemId/solve", auth, markSolvedValidation, validate, markProblemSolved);
router.patch("/:problemId/bookmark", auth, toggleBookmark);
router.patch("/:problemId/content", auth, updateProblemContentValidation, validate, updateProblemContent);

router.get("/custom/all", auth, getCustomProblems);
router.post("/custom", auth, createCustomProblemValidation, validate, createCustomProblem);
router.patch("/custom/:customProblemId", auth, updateCustomProblem);
router.delete("/custom/:customProblemId", auth, deleteCustomProblem);
router.post("/custom/:customProblemId/solve", auth, markSolvedValidation, validate, markCustomProblemSolved);

export default router;
