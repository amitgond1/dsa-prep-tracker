import { body } from "express-validator";
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  addDays,
  addMonths
} from "date-fns";
import CustomProblem from "../models/CustomProblem.js";
import Problem from "../models/Problem.js";
import User from "../models/User.js";
import UserProblem from "../models/UserProblem.js";
import { getNextSolveDate, getRevisionStatus } from "../utils/spacedRepetition.js";
import { updateStreakOnSolve } from "../utils/streak.js";

export const markSolvedValidation = [
  body("timeTaken").optional().isInt({ min: 1, max: 600 }),
  body("selfRating").optional().isIn(["Easy", "Medium", "Hard"]),
  body("notes").optional().isString()
];

const markSolvedCommon = async ({ req, entity, isCustom }) => {
  const now = new Date();
  const payload = req.body;

  if (!entity) {
    return null;
  }

  if (isCustom) {
    entity.solveCount += 1;
    entity.lastSolvedDate = now;
    entity.nextSolveDate = getNextSolveDate(entity.solveCount, now);
    entity.solveHistory.push({
      attemptNumber: entity.solveCount,
      date: now,
      timeTaken: payload.timeTaken,
      selfRating: payload.selfRating,
      notes: payload.notes || ""
    });
    await entity.save();
    return entity;
  }

  const problemId = entity._id;
  const existing = await UserProblem.findOne({ userId: req.user._id, problemId });
  const doc =
    existing ||
    (await UserProblem.create({
      userId: req.user._id,
      problemId,
      status: "unsolved",
      solveCount: 0,
      solveHistory: []
    }));

  doc.status = "solved";
  doc.solveCount += 1;
  doc.lastSolvedDate = now;
  doc.nextSolveDate = getNextSolveDate(doc.solveCount, now);
  doc.solveHistory.push({
    attemptNumber: doc.solveCount,
    date: now,
    timeTaken: payload.timeTaken,
    selfRating: payload.selfRating,
    notes: payload.notes || ""
  });
  await doc.save();
  return doc;
};

export const markProblemSolved = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const progress = await markSolvedCommon({ req, entity: problem, isCustom: false });

    const user = await User.findById(req.user._id);
    updateStreakOnSolve(user);
    await user.save();

    return res.status(200).json({
      message: `Great job! Solve again on ${format(progress.nextSolveDate, "dd MMM yyyy")}`,
      progress
    });
  } catch (error) {
    return next(error);
  }
};

export const markCustomProblemSolved = async (req, res, next) => {
  try {
    const customProblem = await CustomProblem.findOne({ _id: req.params.customProblemId, userId: req.user._id });
    if (!customProblem) {
      return res.status(404).json({ message: "Custom problem not found" });
    }

    const progress = await markSolvedCommon({ req, entity: customProblem, isCustom: true });

    const user = await User.findById(req.user._id);
    updateStreakOnSolve(user);
    await user.save();

    return res.status(200).json({
      message: `Great job! Solve again on ${format(progress.nextSolveDate, "dd MMM yyyy")}`,
      customProblem: progress
    });
  } catch (error) {
    return next(error);
  }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const doc =
      (await UserProblem.findOne({ userId: req.user._id, problemId: problem._id })) ||
      (await UserProblem.create({ userId: req.user._id, problemId: problem._id }));

    doc.isBookmarked = !doc.isBookmarked;
    await doc.save();

    res.status(200).json({ isBookmarked: doc.isBookmarked });
  } catch (error) {
    next(error);
  }
};

export const updateProblemContentValidation = [
  body("notes").optional().isString(),
  body("code").optional().isString()
];

export const updateProblemContent = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const doc =
      (await UserProblem.findOne({ userId: req.user._id, problemId: problem._id })) ||
      (await UserProblem.create({ userId: req.user._id, problemId: problem._id }));

    if (typeof req.body.notes === "string") {
      doc.notes = req.body.notes;
    }
    if (typeof req.body.code === "string") {
      doc.code = req.body.code;
    }

    await doc.save();

    res.status(200).json({ progress: doc });
  } catch (error) {
    next(error);
  }
};

export const getUserProblemMap = async (req, res, next) => {
  try {
    const docs = await UserProblem.find({ userId: req.user._id }).lean();
    const map = docs.reduce((acc, item) => {
      acc[item.problemId.toString()] = item;
      return acc;
    }, {});

    res.status(200).json({ userProblems: map });
  } catch (error) {
    next(error);
  }
};

export const getRevisionQueue = async (req, res, next) => {
  try {
    const docs = await UserProblem.find({ userId: req.user._id, solveCount: { $gt: 0 } })
      .populate("problemId")
      .lean();

    const sections = {
      overdue: [],
      dueToday: [],
      upcoming: []
    };

    for (const doc of docs) {
      const status = getRevisionStatus(doc.nextSolveDate);
      const item = {
        _id: doc._id,
        problem: doc.problemId,
        solveCount: doc.solveCount,
        lastSolvedDate: doc.lastSolvedDate,
        nextSolveDate: doc.nextSolveDate,
        revisionStatus: status
      };

      if (status === "overdue") sections.overdue.push(item);
      if (status === "due-today") sections.dueToday.push(item);
      if (status === "upcoming") sections.upcoming.push(item);
    }

    const dueCount = sections.overdue.length + sections.dueToday.length;
    const inactiveDays = req.user.lastActiveDate
      ? differenceInCalendarDays(startOfDay(new Date()), startOfDay(req.user.lastActiveDate))
      : 999;

    const reminders = [];
    if (dueCount > 0) reminders.push(`${dueCount} problems are due for re-solving today`);
    if (inactiveDays >= 2) reminders.push("You haven't solved anything in 2 days - stay consistent!");
    if (sections.overdue.length > 0) reminders.push(`${sections.overdue.length} problems are overdue - solve them now`);

    res.status(200).json({ sections, reminders });
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const problemsCountPromise = Problem.countDocuments();
    const solvedCountPromise = UserProblem.countDocuments({ userId: req.user._id, solveCount: { $gt: 0 } });

    const todayStart = startOfDay(new Date());
    const solvedTodayPromise = UserProblem.countDocuments({
      userId: req.user._id,
      lastSolvedDate: { $gte: todayStart }
    });

    const dueTodayPromise = UserProblem.countDocuments({
      userId: req.user._id,
      nextSolveDate: { $gte: todayStart, $lt: addDays(todayStart, 1) }
    });

    const recentSolvedPromise = UserProblem.find({ userId: req.user._id, solveCount: { $gt: 0 } })
      .sort({ lastSolvedDate: -1 })
      .limit(5)
      .populate("problemId")
      .lean();

    const topicDataPromise = Problem.aggregate([
      {
        $group: {
          _id: "$topic",
          total: { $sum: 1 }
        }
      }
    ]);

    const solvedTopicPromise = UserProblem.aggregate([
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
      {
        $group: {
          _id: "$problem.topic",
          solved: { $sum: 1 }
        }
      }
    ]);

    const sixMonthsAgo = subMonths(todayStart, 6);
    const heatmapDocsPromise = UserProblem.find(
      {
        userId: req.user._id,
        solveHistory: {
          $elemMatch: {
            date: { $gte: sixMonthsAgo }
          }
        }
      },
      "solveHistory"
    ).lean();

    const difficultyDistPromise = UserProblem.aggregate([
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
      {
        $group: {
          _id: "$problem.difficulty",
          value: { $sum: 1 }
        }
      }
    ]);

    const weeklyTrendPromise = UserProblem.find({ userId: req.user._id, solveCount: { $gt: 0 } }, "solveHistory").lean();

    const [
      totalProblems,
      totalSolved,
      solvedToday,
      dueToday,
      recentSolved,
      topicData,
      solvedTopic,
      heatmapDocs,
      difficultyDistribution,
      weeklyTrendDocs
    ] = await Promise.all([
      problemsCountPromise,
      solvedCountPromise,
      solvedTodayPromise,
      dueTodayPromise,
      recentSolvedPromise,
      topicDataPromise,
      solvedTopicPromise,
      heatmapDocsPromise,
      difficultyDistPromise,
      weeklyTrendPromise
    ]);

    const solvedByTopicMap = solvedTopic.reduce((acc, item) => {
      acc[item._id] = item.solved;
      return acc;
    }, {});

    const topicProgress = topicData.map((item) => ({
      topic: item._id,
      total: item.total,
      solved: solvedByTopicMap[item._id] || 0,
      solvePercent: item.total ? Math.round(((solvedByTopicMap[item._id] || 0) / item.total) * 100) : 0
    }));

    const weakestTopics = [...topicProgress].sort((a, b) => a.solvePercent - b.solvePercent).slice(0, 5);

    const heatmapCounter = {};
    for (const doc of heatmapDocs) {
      for (const attempt of doc.solveHistory || []) {
        const day = format(new Date(attempt.date), "yyyy-MM-dd");
        heatmapCounter[day] = (heatmapCounter[day] || 0) + 1;
      }
    }

    const heatmap = eachDayOfInterval({ start: sixMonthsAgo, end: todayStart }).map((day) => {
      const key = format(day, "yyyy-MM-dd");
      return { date: key, count: heatmapCounter[key] || 0 };
    });

    const weekCounter = {};
    for (const doc of weeklyTrendDocs) {
      for (const attempt of doc.solveHistory || []) {
        const weekKey = format(startOfWeek(new Date(attempt.date), { weekStartsOn: 1 }), "yyyy-MM-dd");
        weekCounter[weekKey] = (weekCounter[weekKey] || 0) + 1;
      }
    }

    const weeklySolveTrend = Object.entries(weekCounter)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => new Date(a.week) - new Date(b.week));

    const stats = {
      totalSolved,
      totalProblems,
      solvedToday,
      currentStreak: req.user.streak,
      problemsDueToday: dueToday
    };

    res.status(200).json({
      stats,
      recentSolved,
      weakestTopics,
      heatmap,
      difficultyDistribution,
      topicProgress,
      weeklySolveTrend
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const sixMonthsAgo = subMonths(startOfDay(now), 6);

    const docs = await UserProblem.find({ userId: req.user._id, solveCount: { $gt: 0 } })
      .populate("problemId")
      .lean();

    const monthlyMap = {};
    const speedSeries = [];
    const topicMasteryMap = {};
    const topicSolvedMap = {};
    const difficultyDistribution = { Easy: 0, Medium: 0, Hard: 0 };
    const companyMap = {};

    for (const item of docs) {
      const topic = item.problemId?.topic;
      if (topic) {
        topicSolvedMap[topic] = (topicSolvedMap[topic] || 0) + 1;
      }

      if (item.problemId?.difficulty) {
        difficultyDistribution[item.problemId.difficulty] += 1;
      }

      for (const company of item.problemId?.companies || []) {
        companyMap[company] = (companyMap[company] || 0) + 1;
      }

      for (const attempt of item.solveHistory || []) {
        const date = new Date(attempt.date);
        if (date >= sixMonthsAgo) {
          const monthKey = format(startOfMonth(date), "yyyy-MM");
          monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + 1;
        }

        if (typeof attempt.timeTaken === "number") {
          speedSeries.push({ date: format(date, "yyyy-MM-dd"), timeTaken: attempt.timeTaken });
        }
      }
    }

    const allTopics = await Problem.aggregate([
      { $group: { _id: "$topic", total: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    for (const row of allTopics) {
      const solved = topicSolvedMap[row._id] || 0;
      topicMasteryMap[row._id] = {
        topic: row._id,
        solved,
        total: row.total,
        mastery: row.total ? Math.round((solved / row.total) * 100) : 0
      };
    }

    const topicMastery = Object.values(topicMasteryMap);
    const weakestTopics = [...topicMastery].sort((a, b) => a.mastery - b.mastery).slice(0, 5);
    const mostSolvedTopics = [...topicMastery].sort((a, b) => b.solved - a.solved).slice(0, 5);

    const monthlySolved = [];
    let cursor = startOfMonth(sixMonthsAgo);
    const end = endOfMonth(now);

    while (cursor <= end) {
      const key = format(cursor, "yyyy-MM");
      monthlySolved.push({ month: key, solved: monthlyMap[key] || 0 });
      cursor = startOfMonth(addMonths(cursor, 1));
    }

    speedSeries.sort((a, b) => new Date(a.date) - new Date(b.date));

    const weeklyStart = startOfWeek(now, { weekStartsOn: 1 });
    const solvedThisWeek = docs.filter((item) =>
      item.solveHistory?.some((attempt) => new Date(attempt.date) >= weeklyStart)
    ).length;

    res.status(200).json({
      monthlySolved,
      speedSeries,
      topicMastery,
      difficultyDistribution: Object.entries(difficultyDistribution).map(([name, value]) => ({ name, value })),
      bestStreak: req.user.bestStreak || 0,
      currentStreak: req.user.streak || 0,
      mostSolvedTopics,
      weakestTopics,
      solvedByCompany: Object.entries(companyMap).map(([name, value]) => ({ name, value })),
      solvedThisWeek
    });
  } catch (error) {
    next(error);
  }
};

export const createCustomProblemValidation = [
  body("title").trim().isLength({ min: 2 }),
  body("link").isURL(),
  body("difficulty").isIn(["Easy", "Medium", "Hard"]),
  body("topic").trim().isLength({ min: 2 }),
  body("notes").optional().isString()
];

export const createCustomProblem = async (req, res, next) => {
  try {
    const customProblem = await CustomProblem.create({
      userId: req.user._id,
      title: req.body.title,
      link: req.body.link,
      difficulty: req.body.difficulty,
      topic: req.body.topic,
      notes: req.body.notes || "",
      isBookmarked: true
    });

    res.status(201).json({ customProblem });
  } catch (error) {
    next(error);
  }
};

export const getBookmarks = async (req, res, next) => {
  try {
    const userBookmarks = await UserProblem.find({ userId: req.user._id, isBookmarked: true })
      .populate("problemId")
      .lean();
    const customBookmarks = await CustomProblem.find({ userId: req.user._id, isBookmarked: true }).lean();

    res.status(200).json({
      problems: userBookmarks,
      customProblems: customBookmarks
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomProblems = async (req, res, next) => {
  try {
    const customProblems = await CustomProblem.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ customProblems });
  } catch (error) {
    next(error);
  }
};

export const updateCustomProblem = async (req, res, next) => {
  try {
    const allowed = ["title", "link", "difficulty", "topic", "notes", "isBookmarked"];
    const updates = {};

    for (const field of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const customProblem = await CustomProblem.findOneAndUpdate(
      { _id: req.params.customProblemId, userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!customProblem) {
      return res.status(404).json({ message: "Custom problem not found" });
    }

    res.status(200).json({ customProblem });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomProblem = async (req, res, next) => {
  try {
    const deleted = await CustomProblem.findOneAndDelete({ _id: req.params.customProblemId, userId: req.user._id });
    if (!deleted) {
      return res.status(404).json({ message: "Custom problem not found" });
    }

    res.status(200).json({ message: "Custom problem deleted" });
  } catch (error) {
    next(error);
  }
};


