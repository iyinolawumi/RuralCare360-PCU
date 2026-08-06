const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['patient', 'healthworker', 'admin'],
        default: 'patient'
    },
    phone: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // ── Health worker specific fields ──────────────────
    specialization: {
        type: String,
        enum: ['general', 'pediatrics', 'obstetrics', 'internal', 'surgery', 'other'],
    },
    licenseNumber: {
        type: String,
        trim: true
    },
    yearsOfExperience: {
        type: Number,
        default: 0
    },
    hospitalAffiliation: {
        type: String,
        trim: true
    },
    address: {
        state: { type: String },
        lga:   { type: String }
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);