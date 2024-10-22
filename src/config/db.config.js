import mongoose from 'mongoose'

const connectMongoDB = async () => {
  try {
    await mongoose.connect(import.meta.env.VITE_MONGO_URI)
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}

export default connectMongoDB
