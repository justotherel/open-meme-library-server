import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    profilePic: {
        type: String,
        default:
            'https://sun9-24.userapi.com/impf/_pX1Z4FcdFvpgJ-ZmyIAHF8UGKGzVIxt7d7cgA/nnPTPaAjnEw.jpg?size=640x640&quality=96&sign=1c98fc5c553f78a1d505abd10ff34710',
    },
    createdAt: { type: Date, default: new Date() },
})

export default mongoose.model('User', userSchema)
