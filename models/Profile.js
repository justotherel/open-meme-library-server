import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
    username: {type: String, required: true},
    description: { type: String, default: 'let them know' },
})

export default mongoose.model('Profile', profileSchema)
