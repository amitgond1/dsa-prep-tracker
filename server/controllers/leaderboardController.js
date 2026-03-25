import { startOfWeek } from "date-fns";
import User from "../models/User.js";
import UserProblem from "../models/UserProblem.js";

export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ isPublic: true }, "name streak bestStreak targetCompany").lean();
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

    const rows = [];
    for (const user of users) {
      const totalSolved = await UserProblem.countDocuments({ userId: user._id, solveCount: { $gt: 0 } });
      const solvedThisWeek = await UserProblem.countDocuments({
        userId: user._id,
        solveHistory: { $elemMatch: { date: { $gte: weekStart } } }
      });

      rows.push({
        userId: user._id,
        name: user.name,
        targetCompany: user.targetCompany,
        totalSolved,
        currentStreak: user.streak || 0,
        bestStreak: user.bestStreak || 0,
        solvedThisWeek
      });
    }

    rows.sort((a, b) => {
      if (b.totalSolved !== a.totalSolved) return b.totalSolved - a.totalSolved;
      if (b.currentStreak !== a.currentStreak) return b.currentStreak - a.currentStreak;
      return b.solvedThisWeek - a.solvedThisWeek;
    });

    const myIndex = rows.findIndex((item) => item.userId.toString() === req.user._id.toString());
    const percentile = myIndex >= 0 ? Math.max(1, Math.round(((rows.length - myIndex) / rows.length) * 100)) : null;

    res.status(200).json({
      leaderboard: rows,
      message: percentile ? `You are top ${percentile}% this week!` : null
    });
  } catch (error) {
    next(error);
  }
};
