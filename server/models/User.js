import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const plannerTaskSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      required: true
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem"
    },
    customProblemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomProblem"
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    topic: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    targetCompany: {
      type: String,
      default: ""
    },
    targetDate: {
      type: Date
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    dailyGoal: {
      type: Number,
      default: 2,
      min: 1,
      max: 20
    },
    streak: {
      type: Number,
      default: 0,
      min: 0
    },
    bestStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    lastActiveDate: {
      type: Date
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    plannerTasks: {
      type: [plannerTaskSchema],
      default: []
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
