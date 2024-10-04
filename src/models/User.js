import { model, Schema } from 'mongoose'

const schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      require: true,
    },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export default model('User', schema)
