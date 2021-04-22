import User from '../models/User.js'
import Profile from '../models/Profile.js'

export const getProfile = async (req, res) => {
    const { user: username } = req.params

    try {
        const user = await User.findOne({ username })
        const profile = await Profile.findOne({ username })

        if (!user || !profile)
            return res.status(404).json({
                message: `No profile with username ${username}`,
            })

        let profilePic = user.profilePic
        if (!profilePic) {
            profilePic = 'https://sun9-24.userapi.com/impg/_pX1Z4FcdFvpgJ-ZmyIAHF8UGKGzVIxt7d7cgA/nnPTPaAjnEw.jpg?size=640x640&quality=96&sign=1c98fc5c553f78a1d505abd10ff34710&'
        }

        res.status(200).json({ profilePic, profile })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            data: {},
            message: '',
            error: 'Internal server error. Something went worng',
        })
    }
}

export const editProfile = async (req, res) => {
    const { user: username } = req.params
    const { url, description} = req.body

    try {
        const user = await User.findOne({ username })
        const profile = await Profile.findOne({ username })

        if (!user || !profile)
            return res.status(404).json({
                message: `No profile with username ${username}`,
            })
        const updatedUser = {
            ...user,
            profilePic: url
        }
        
        profile.description = description

        await User.findByIdAndUpdate(user._id, updatedUser, { new: true })
        await Profile.findByIdAndUpdate(profile._id, profile, { new: true })

        res.status(200).json({ profilePic: url, profile })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            data: {},
            message: '',
            error: 'Internal server error. Something went worng',
        })
    }
}
