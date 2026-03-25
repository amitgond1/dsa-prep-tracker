import express from "express";
import {
  getProfile,
  login,
  loginValidation,
  register,
  registerValidation,
  updateProfile,
  updateProfileValidation
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfileValidation, validate, updateProfile);

export default router;
