import { model, Schema } from 'mongoose'
import slugify from 'slugify'

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'inactive'],
      default: 'draft',
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

schema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

export default model('Product', schema)
