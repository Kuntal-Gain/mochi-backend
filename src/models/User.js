const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const historySchema = new mongoose.Schema({
    mangaId: { type: String, required: true },
    chapterId: { type: String, required: true },
    pageNo: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const readingListSchema = new mongoose.Schema({
    mangaId: { type: String, required: true },
    chapterId: { type: String, required: true },
    status: {
        type: String,
        enum: ['completed', 'currently reading', 'dropped'],
        default: 'currently reading'
    },
    timeSpent: { type: Number, default: 0 } // in minutes
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    history: [historySchema],
    readingList: [readingListSchema],
    favouriteManga: [String],
    timeSpent: {
        type: Number,
        default: 0
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Calculate total timeSpent
userSchema.pre('save', function (next) {
    this.timeSpent = this.readingList.reduce((total, item) => total + item.timeSpent, 0);
    next();
});

module.exports = mongoose.model('User', userSchema); 