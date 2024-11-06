import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import morgan from 'morgan'
import connectMongoDB from './database/connectMongoDB.js'
import router from './routes/index.js'

connectMongoDB()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.get('/', (req, res) => {
  res.status(StatusCodes.OK).send('Welcome to Spring Store API')
})
app.use('/api', router)
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).send('Route not found')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
