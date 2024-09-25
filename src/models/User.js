import { model, Schema } from 'mongoose'

const schema = new Schema(
  {
    email: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      default: 'member',
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
