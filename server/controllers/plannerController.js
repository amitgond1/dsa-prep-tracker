import { body } from "express-validator";
import Problem from "../models/Problem.js";
import User from "../models/User.js";
import UserProblem from "../models/UserProblem.js";

const weekDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const plannerValidation = [
  body("tasks").isArray({ min: 0, max: 50 }),
  body("tasks.*.day").isIn(weekDays),
  body("tasks.*.title").isString().isLength({ min: 2 }),
  body("tasks.*.topic").optional().isString(),
  body("tasks.*.problemId").optional().isMongoId(),
  body("tasks.*.customProblemId").optional().isMongoId()
];

export const getPlanner = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id, "plannerTasks").lean();

    const topicTotals = await Problem.aggregate([{ $group: { _id: "$topic", total: { $sum: 1 } } }]);
    const solvedByTopic = await UserProblem.aggregate([
      { $match: { userId: req.user._id, solveCount: { $gt: 0 } } },
      {
        $lookup: {
          from: "problems",
          localField: "problemId",
          foreignField: "_id",
          as: "problem"
        }
      },
      { $unwind: "$problem" },
      { $group: { _id: "$problem.topic", solved: { $sum: 1 } } }
    ]);

    const solvedMap = solvedByTopic.reduce((acc, row) => {
      acc[row._id] = row.solved;
      return acc;
    }, {});

    const weakest = topicTotals
      .map((row) => {
        const solved = solvedMap[row._id] || 0;
        const pct = row.total ? solved / row.total : 0;
        return { topic: row._id, score: pct };
      })
      .sort((a, b) => a.score - b.score)[0];

    const suggestion = weakest
      ? `Solve 3 ${weakest.topic} problems this week (your weakest topic)`
      : "Start by solving 3 problems this week";

    res.status(200).json({ tasks: user?.plannerTasks || [], suggestion });
  } catch (error) {
    next(error);
  }
};

export const savePlanner = async (req, res, next) => {
  try {
    const tasks = req.body.tasks || [];
    const updated = await User.findByIdAndUpdate(req.user._id, { plannerTasks: tasks }, { new: true }).lean();

    res.status(200).json({ tasks: updated.plannerTasks || [] });
  } catch (error) {
    next(error);
  }
};
