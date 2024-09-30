import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import connectMongoDB from './config/db'
import router from './routes'

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

connectMongoDB(import.meta.env.VITE_MONGO_URI)

app.listen(3000)
app.use('/', router)

export const viteNodeApp = app
