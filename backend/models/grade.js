const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  grade: { type: Number, required: true }, // Or any other appropriate type
  // Add any other grade-related fields as needed
});

module.exports = mongoose.model("Grade", gradeSchema);
