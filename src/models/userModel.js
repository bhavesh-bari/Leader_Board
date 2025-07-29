import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    imageUrl: {
        type: String,
        default: '/images/default-avatar.png', // A default image
    },
    totalPoints: {
        type: Number,
        default: 0,
    },
    history:[{
        userName: {
            type: String,
            required: true,
        },
        imageUrl: {
        type: String,
        default: '/images/default-avatar.png', // A default image
    },
        points: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },

    }]
}, { timestamps: true });

// Avoid re-creating the model if it already exists
export default mongoose.models.User || mongoose.model('User', userSchema);