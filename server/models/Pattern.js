import mongoose from "mongoose";

const patternSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    explanation: {
      type: String,
      required: true
    },
    whenToUse: {
      type: String,
      required: true
    },
    jsTemplate: {
      type: String,
      required: true
    },
    pyTemplate: {
      type: String,
      required: true
    },
    complexity: {
      type: String,
      required: true
    },
    relatedProblems: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Pattern", patternSchema);
