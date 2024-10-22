import { model, Schema } from 'mongoose'

const schema = new Schema(
  {
    token: { type: String, required: true },
    expiryDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

schema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 })

export default model('BlacklistedToken', schema)
