import express from 'express'
import morgan from 'morgan'
import connectMongoDB from './config/db'
import router from './routes'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

connectMongoDB('mongodb://localhost:27017/web209')

app.listen(3000)
app.use('/', router)

export const viteNodeApp = app
