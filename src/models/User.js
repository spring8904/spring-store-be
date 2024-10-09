import { model, Schema } from 'mongoose'

const schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export default model('User', schema)
