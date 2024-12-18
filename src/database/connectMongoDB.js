import mongoose from 'mongoose'

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}

export default connectMongoDB
