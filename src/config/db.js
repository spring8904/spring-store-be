import mongoose from 'mongoose'

async function connectMongoDB(uri) {
  try {
    await mongoose.connect(uri)
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}

export default connectMongoDB
