//this file defines how a User looks in your database
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    streak: { type: Number, default: 0 },
    lastActiveDate: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    try {
        //check if the password has been modified
        if (!this.isModified('password')) return next();

        //generate a salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next(); //proceed to save
    } catch (err) {
        next(err); //pass any errors to the next middleware
    }
});


userSchema.methods.isValidPassword = async function (plain) {
    try {
        //compare provided password with stored hash
        return await bcrypt.compare(plain, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
}


module.exports = mongoose.model('User', userSchema);
