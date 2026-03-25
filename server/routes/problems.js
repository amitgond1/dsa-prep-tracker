import express from "express";
import {
  getCompaniesCatalog,
  getCompanySheet,
  getFaangTopSheet,
  getProblemById,
  getProblems,
  getProblemsValidation
} from "../controllers/problemsController.js";
import auth from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", auth, getProblemsValidation, validate, getProblems);
router.get("/companies", auth, getCompaniesCatalog);
router.get("/company/:companyName", auth, getCompanySheet);
router.get("/faang-top", auth, getFaangTopSheet);
router.get("/:id", auth, getProblemById);

export default router;
