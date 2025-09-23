import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    qIndex: Number,
    answer: String,
    evaluation: mongoose.Schema.Types.Mixed,
    at: { type: Date, default: Date.now },
});

const QuestionSchema = new mongoose.Schema({
    id: String,
    qIndex: Number,
    text: String,
    type: String,
    options: [String],
});

const InterviewSchema = new mongoose.Schema({
    userId: String,
    skills: [String],
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    total: Number,
    questions: [QuestionSchema],
    answers: [AnswerSchema],
});

export default mongoose.model("Interview", InterviewSchema);