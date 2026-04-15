const mongoose = require('mongoose');

const ApproachSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Brute Force / Better / Optimal
    idea: String,
    timeComplexity: String,
    spaceComplexity: String,
    code: String,
}, { _id: false });


const problemSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    //core fields 
    name: { type: String, required: true, trim: true },
    link: { type: String, trim: true },
    topic: {
        type: String,
        enum: ['Array', 'String', 'Linked List', 'Tree', 'Graph', 'DP', 'Backtracking',
            'Binary Search', 'Heap', 'Stack & Queue', 'Greedy', 'Hashing', 'Math',
            'Sliding Window', 'Two Pointers', 'Other'],
        required: true
    },
    pattern: { type: String, trim: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    status: { type: String, enum: ['New', 'Learning', 'Weak', 'Strong'], default: 'New' },
    confidence: { type: Number, min: 1, max: 5, default: 1 },
    tags: [String],

    // Notes
    summary: String,
    keyInsight: String,
    approaches: [ApproachSchema],
    mistakesMade: String,

    // Spaced repetition
    revisionHistory: [{ type: Date }],
    lastRevised: Date,
    nextRevision: { type: Date, default: Date.now },
    revisionIntervalIndex: { type: Number, default: 0 }, // tracks position in [1,3,7,15,30,60,120]
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);