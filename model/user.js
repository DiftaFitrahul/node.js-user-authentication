import mongoose from "mongoose";

export const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide uniqe username'],
        unique: [true, 'Username exist']
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        unique: false,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: [true, 'Email exist']
    },
    firstName: {type: String},
    lastName: {type: String},
    phone: {type: Number},
    address: {type: String},
    profile: {type: String}
});

export default mongoose.model.Users || mongoose.model('User', UserSchema)