import { query } from "express-validator";
import { getRevisionStatus } from "../utils/spacedRepetition.js";
import Problem from "../models/Problem.js";
import UserProblem from "../models/UserProblem.js";

const difficultyWeight = { Easy: 1, Medium: 2, Hard: 3 };
const faangCompanies = ["Google", "Amazon", "Meta", "Apple", "Netflix"];

const parseCsv = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseLimit = (value, fallback = 100) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(150, Math.max(1, parsed));
};

const buildUserProgressMap = async (userId) => {
  const userProblems = await UserProblem.find({ userId }).lean();
  return new Map(userProblems.map((item) => [item.problemId.toString(), item]));
};

const mergeWithProgress = (problems, progressMap) => {
  return problems.map((problem) => {
    const progress = progressMap.get(problem._id.toString());
    const revisionStatus = progress?.nextSolveDate ? getRevisionStatus(progress.nextSolveDate) : "unscheduled";

    let status = "Unsolved";
    if (progress?.solveCount > 0) {
      status = revisionStatus === "overdue" || revisionStatus === "due-today" ? "Due for Revision" : "Solved";
    }

    return {
      ...problem,
      status,
      lastSolvedDate: progress?.lastSolvedDate || null,
      nextSolveDate: progress?.nextSolveDate || null,
      solveCount: progress?.solveCount || 0,
      isBookmarked: progress?.isBookmarked || false,
      revisionStatus
    };
  });
};

export const getProblemsValidation = [
  query("difficulty").optional().isString(),
  query("topic").optional().isString(),
  query("status").optional().isString(),
  query("pattern").optional().isString(),
  query("company").optional().isString(),
  query("search").optional().isString(),
  query("sortBy").optional().isString()
];

export const getProblems = async (req, res, next) => {
  try {
    const topics = parseCsv(req.query.topic);
    const difficulties = parseCsv(req.query.difficulty);
    const patterns = parseCsv(req.query.pattern);
    const companies = parseCsv(req.query.company);
    const statusFilter = req.query.status || "All";
    const search = (req.query.search || "").trim();
    const sortBy = req.query.sortBy || "number";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    const match = {};
    if (topics.length) match.topic = { $in: topics };
    if (difficulties.length) match.difficulty = { $in: difficulties };
    if (patterns.length) match.pattern = { $in: patterns };
    if (companies.length) match.companies = { $in: companies };
    if (search) match.title = { $regex: search, $options: "i" };

    const problems = await Problem.find(match).lean();
    const progressMap = await buildUserProgressMap(req.user._id);

    let merged = mergeWithProgress(problems, progressMap);

    if (statusFilter !== "All") {
      merged = merged.filter((item) => {
        if (statusFilter === "Solved") return item.status === "Solved";
        if (statusFilter === "Unsolved") return item.status === "Unsolved";
        if (statusFilter === "Due Today") return item.revisionStatus === "due-today";
        if (statusFilter === "Bookmarked") return item.isBookmarked;
        return true;
      });
    }

    merged.sort((a, b) => {
      if (sortBy === "difficulty") {
        return (difficultyWeight[a.difficulty] - difficultyWeight[b.difficulty]) * sortOrder;
      }
      if (sortBy === "lastSolved") {
        const left = a.lastSolvedDate ? new Date(a.lastSolvedDate).getTime() : 0;
        const right = b.lastSolvedDate ? new Date(b.lastSolvedDate).getTime() : 0;
        return (left - right) * sortOrder;
      }
      if (sortBy === "nextDue") {
        const left = a.nextSolveDate ? new Date(a.nextSolveDate).getTime() : Number.MAX_SAFE_INTEGER;
        const right = b.nextSolveDate ? new Date(b.nextSolveDate).getTime() : Number.MAX_SAFE_INTEGER;
        return (left - right) * sortOrder;
      }
      if (sortBy === "solveCount") {
        return (a.solveCount - b.solveCount) * sortOrder;
      }
      return (a.number - b.number) * sortOrder;
    });

    res.status(200).json({ problems: merged, total: merged.length });
  } catch (error) {
    next(error);
  }
};

export const getCompaniesCatalog = async (req, res, next) => {
  try {
    const rows = await Problem.aggregate([
      { $unwind: "$companies" },
      {
        $group: {
          _id: "$companies",
          total: { $sum: 1 },
          importantCount: {
            $sum: {
              $cond: ["$isCompanyImportant", 1, 0]
            }
          }
        }
      },
      { $sort: { importantCount: -1, total: -1, _id: 1 } }
    ]);

    res.status(200).json({
      faangCompanies,
      companies: rows.map((item) => ({
        name: item._id,
        total: item.total,
        importantCount: item.importantCount
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanySheet = async (req, res, next) => {
  try {
    const companyName = decodeURIComponent(req.params.companyName);
    const limit = parseLimit(req.query.limit, 100);
    const importantOnly = req.query.importantOnly !== "false";

    const match = { companies: companyName };
    if (importantOnly) {
      match.isCompanyImportant = true;
    }

    const problems = await Problem.find(match).sort({ frequencyScore: -1, number: 1 }).limit(limit).lean();
    const progressMap = await buildUserProgressMap(req.user._id);

    res.status(200).json({
      company: companyName,
      importantOnly,
      count: problems.length,
      problems: mergeWithProgress(problems, progressMap)
    });
  } catch (error) {
    next(error);
  }
};

export const getFaangTopSheet = async (req, res, next) => {
  try {
    const limit = parseLimit(req.query.limit, 100);

    const problems = await Problem.find({
      companies: { $in: faangCompanies },
      isCompanyImportant: true
    })
      .sort({ frequencyScore: -1, number: 1 })
      .limit(limit)
      .lean();

    const progressMap = await buildUserProgressMap(req.user._id);

    res.status(200).json({
      companyGroup: "FAANG",
      companies: faangCompanies,
      count: problems.length,
      problems: mergeWithProgress(problems, progressMap)
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id).lean();
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const progress = await UserProblem.findOne({
      userId: req.user._id,
      problemId: problem._id
    }).lean();

    res.status(200).json({
      problem,
      progress: progress || null
    });
  } catch (error) {
    next(error);
  }
};
