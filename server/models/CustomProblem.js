import mongoose from "mongoose";

const customProblemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    link: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    notes: {
      type: String,
      default: ""
    },
    isBookmarked: {
      type: Boolean,
      default: true
    },
    solveCount: {
      type: Number,
      default: 0,
      min: 0
    },
    lastSolvedDate: {
      type: Date
    },
    nextSolveDate: {
      type: Date
    },
    solveHistory: {
      type: [
        {
          attemptNumber: Number,
          date: Date,
          timeTaken: Number,
          selfRating: {
            type: String,
            enum: ["Easy", "Medium", "Hard"]
          },
          notes: String
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

customProblemSchema.index({ userId: 1, isBookmarked: 1 });

export default mongoose.model("CustomProblem", customProblemSchema);
