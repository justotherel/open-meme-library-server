import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'
import Profile from '../models/Profile.js'

import { JWT_SECRET } from '../config/config.js'

export const signin = async (req, res) => {
    const { username, password } = req.body

    try {
        const existingUser = await User.findOne({ username })
        if (!existingUser)
            return res.status(404).json({
                status: 'error',
                data: {},
                message: '',
                error: 'User does not exist',
            })

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password,
        )

        if (!isPasswordCorrect)
            return res.status(400).json({
                status: 'error',
                data: {},
                message: '',
                error: 'Invalid credentials',
            })

        const token = jwt.sign(
            {
                username: existingUser.username,
                email: existingUser.email,
                id: existingUser._id,
            },
            JWT_SECRET,
            { expiresIn: '1h' },
        )

        const id = existingUser._id
        const profilePic = existingUser.profilePic

        res.status(200).json({
            status: 'ok',
            data: { username, id, profilePic, token },
            message: 'logged in successfully',
            error: null,
        })
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

export const signup = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body

    try {
        const usernameExists = await User.findOne({ email })
        const emailExists = await User.findOne({ username })
        console.log(emailExists)

        if (emailExists)
            return res.status(400).json({
                status: 'error',
                data: {},
                message: '',
                error: 'User with this email already exists',
            })

        if (usernameExists)
            return res.status(400).json({
                status: 'error',
                data: {},
                message: '',
                error: 'User with this username already exists',
            })

        if (password != confirmPassword)
            return res.status(400).json({
                status: 'error',
                data: {},
                message: '',
                error: "Passwords don't not match",
            })

        const hashedPassword = await bcrypt.hash(password, 12)
        const result = await User.create({
            email,
            username,
            password: hashedPassword,
            profilePic: '',
        })
        const profile = await Profile.create({
            username,
            description: 'let them know',
        })
        const token = jwt.sign(
            {
                username: result.username,
                id: result._id,
                profilePic: result.profilePic,
            },
            JWT_SECRET,
            { expiresIn: '1h' },
        )

        const id = result._id

        res.status(200).json({
            status: 'ok',
            data: { username, id, profilePic, token },
            message: 'User registered successfully',
            error: null,
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            data: {},
            message: '',
            error: 'Internal server error. Something went worng',
        })
    }
}
