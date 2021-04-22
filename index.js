import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import postsRoutes from './routes/posts.routers.js'
import userRoutes from './routes/users.routers.js'
import profilesRoutes from './routes/profiles.routes.js'

import { MONGO_URI, PORT } from './config/config.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))

app.options('*', cors())

app.use('/posts', postsRoutes)
app.use('/users', userRoutes)
app.use('/profiles', profilesRoutes)

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('🤡 MongoDB connection established 🤡')
        app.listen(PORT, () => {
            console.log(`🚀  Server ready at http://localhost:5000`)
        })
    })
    .catch((error) => console.log(error))
mongoose.set('useFindAndModify', false)
