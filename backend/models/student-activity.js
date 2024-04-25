const mongoose = require("mongoose");

const studentActivitySchema = new mongoose.Schema(
  {
    student: { type: mongoose.Types.ObjectId, required: false, ref: "User" },
    course: { type: mongoose.Types.ObjectId, required: false, ref: "Course" },
    lesson: { type: mongoose.Types.ObjectId, required: false, ref: "Lesson" },
    notes: [{ type: mongoose.Types.ObjectId, required: false, ref: "StudentNote" }],
    filePaths: [{ type: String, required: false }],
    grade: { type: String, required: false, default: "--" },
  },
  { collection: "StudentActivity", timestamps: true }
);

const StudentActivity = mongoose.model(
  "StudentActivity",
  studentActivitySchema
);
module.exports = StudentActivity;
