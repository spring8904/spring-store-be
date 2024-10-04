import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import connectMongoDB from './config/db'
import router from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use('/api', router)

connectMongoDB(import.meta.env.VITE_MONGO_URI)

export const viteNodeApp = app
