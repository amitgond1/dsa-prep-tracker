import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
      index: true
    },
    topic: {
      type: String,
      required: true,
      index: true
    },
    pattern: {
      type: String,
      required: true
    },
    leetcodeLink: {
      type: String,
      required: true
    },
    companies: {
      type: [String],
      default: []
    },
    isCompanyImportant: {
      type: Boolean,
      default: false,
      index: true
    },
    frequencyScore: {
      type: Number,
      default: 0,
      min: 0,
      index: true
    }
  },
  { timestamps: true }
);

problemSchema.index({ title: "text", topic: "text", pattern: "text" });

export default mongoose.model("Problem", problemSchema);
