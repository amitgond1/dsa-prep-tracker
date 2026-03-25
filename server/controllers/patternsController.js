import Pattern from "../models/Pattern.js";

export const getPatterns = async (req, res, next) => {
  try {
    const patterns = await Pattern.find().sort({ name: 1 }).lean();
    res.status(200).json({ patterns });
  } catch (error) {
    next(error);
  }
};

export const getPatternByName = async (req, res, next) => {
  try {
    const patternName = decodeURIComponent(req.params.patternName);
    const pattern = await Pattern.findOne({ name: patternName }).lean();

    if (!pattern) {
      return res.status(404).json({ message: "Pattern not found" });
    }

    res.status(200).json({ pattern });
  } catch (error) {
    next(error);
  }
};
