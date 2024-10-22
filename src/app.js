import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import connectMongoDB from './config/db.config'
import router from './routes'

connectMongoDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use('/api', router)

export const viteNodeApp = app
