import { body } from "express-validator";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

export const registerValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("targetCompany").optional().isString(),
  body("targetDate").optional().isISO8601().withMessage("targetDate must be a valid date"),
  body("level")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Invalid level")
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

export const updateProfileValidation = [
  body("name").optional().trim().isLength({ min: 2 }),
  body("targetCompany").optional().isString(),
  body("targetDate").optional({ values: "falsy" }).isISO8601(),
  body("level").optional().isIn(["Beginner", "Intermediate", "Advanced"]),
  body("dailyGoal").optional().isInt({ min: 1, max: 20 }),
  body("isPublic").optional().isBoolean()
];

export const register = async (req, res, next) => {
  try {
    const { name, email, password, targetCompany, targetDate, level } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      targetCompany,
      targetDate,
      level
    });

    const token = signToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetCompany: user.targetCompany,
        targetDate: user.targetDate,
        level: user.level,
        dailyGoal: user.dailyGoal,
        streak: user.streak,
        bestStreak: user.bestStreak,
        isPublic: user.isPublic
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetCompany: user.targetCompany,
        targetDate: user.targetDate,
        level: user.level,
        dailyGoal: user.dailyGoal,
        streak: user.streak,
        bestStreak: user.bestStreak,
        isPublic: user.isPublic
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "targetCompany", "targetDate", "level", "dailyGoal", "isPublic"];
    const updates = {};

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
      select: "-password"
    });

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
