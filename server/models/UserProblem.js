import mongoose from "mongoose";

const solveAttemptSchema = new mongoose.Schema(
  {
    attemptNumber: {
      type: Number,
      required: true,
      min: 1
    },
    date: {
      type: Date,
      required: true
    },
    timeTaken: {
      type: Number,
      min: 0
    },
    selfRating: {
      type: String,
      enum: ["Easy", "Medium", "Hard"]
    },
    notes: {
      type: String,
      default: ""
    }
  },
  { _id: false }
);

const userProblemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["unsolved", "solved"],
      default: "unsolved"
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
      type: [solveAttemptSchema],
      default: []
    },
    notes: {
      type: String,
      default: ""
    },
    code: {
      type: String,
      default: ""
    },
    isBookmarked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

userProblemSchema.index({ userId: 1, problemId: 1 }, { unique: true });
userProblemSchema.index({ userId: 1, nextSolveDate: 1 });

export default mongoose.model("UserProblem", userProblemSchema);
