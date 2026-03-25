import express from "express";
import {
  getNotifications,
  markAllAsRead,
  markNotificationAsRead
} from "../controllers/notificationsController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getNotifications);
router.patch("/:notificationId/read", auth, markNotificationAsRead);
router.patch("/read-all", auth, markAllAsRead);

export default router;
