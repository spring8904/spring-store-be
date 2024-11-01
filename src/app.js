import cors from 'cors'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import morgan from 'morgan'
import connectMongoDB from './config/db.config'
import router from './routes'

connectMongoDB()

const app = express()
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use('/api', router)

app.use((req, res) => res.status(StatusCodes.NOT_FOUND).json('Route not found'))

app.listen(PORT)

export const viteNodeApp = app
