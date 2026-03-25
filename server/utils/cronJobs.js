import cron from "node-cron";
import { endOfDay, startOfDay, subDays } from "date-fns";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import UserProblem from "../models/UserProblem.js";

const dailyCron = "0 0 * * *";

async function updateUserStreaks(todayStart) {
  const users = await User.find({}, "_id streak bestStreak lastActiveDate");

  for (const user of users) {
    if (!user.lastActiveDate) {
      user.streak = 0;
      await user.save();
      continue;
    }

    const lastActive = startOfDay(user.lastActiveDate);
    const yesterday = subDays(todayStart, 1);

    // Keep streak if user solved yesterday; reset only after a gap beyond one day.
    if (lastActive < yesterday) {
      user.streak = 0;
      await user.save();
    }
  }
}

async function generateRevisionNotifications(todayStart) {
  const aggregation = await UserProblem.aggregate([
    {
      $match: {
        nextSolveDate: { $lte: endOfDay(todayStart) },
        solveCount: { $gt: 0 }
      }
    },
    {
      $group: {
        _id: "$userId",
        dueCount: { $sum: 1 }
      }
    }
  ]);

  for (const item of aggregation) {
    const exists = await Notification.exists({
      userId: item._id,
      type: "revision-daily",
      createdAt: { $gte: todayStart, $lte: endOfDay(todayStart) }
    });

    if (!exists && item.dueCount > 0) {
      await Notification.create({
        userId: item._id,
        message: `${item.dueCount} problems are due for re-solving today`,
        type: "revision-daily"
      });
    }
  }
}

async function generateInactiveNotifications(todayStart) {
  const twoDaysAgo = subDays(todayStart, 2);
  const users = await User.find(
    {
      $or: [{ lastActiveDate: { $lt: twoDaysAgo } }, { lastActiveDate: { $exists: false } }]
    },
    "_id"
  );

  for (const user of users) {
    const exists = await Notification.exists({
      userId: user._id,
      type: "inactive-daily",
      createdAt: { $gte: todayStart, $lte: endOfDay(todayStart) }
    });

    if (!exists) {
      await Notification.create({
        userId: user._id,
        message: "You haven't solved anything in 2 days - stay consistent!",
        type: "inactive-daily"
      });
    }
  }
}

export const runDailyMaintenance = async () => {
  const todayStart = startOfDay(new Date());

  await updateUserStreaks(todayStart);
  await generateRevisionNotifications(todayStart);
  await generateInactiveNotifications(todayStart);
};

export const startCronJobs = () => {
  cron.schedule(dailyCron, async () => {
    try {
      await runDailyMaintenance();
      // eslint-disable-next-line no-console
      console.log("Daily maintenance completed");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Daily maintenance failed", error);
    }
  });
};
