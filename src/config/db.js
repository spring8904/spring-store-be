import mongoose from 'mongoose'

const connectMongoDB = async (uri) => {
  try {
    await mongoose.connect(uri)
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}

export default connectMongoDB
