import Product from '../models/Product'
import { createValidator, updateValidator } from '../validations/product'

export const getAllProduct = async (req, res) => {
  try {
    const data = await Product.find()
    res.status(200).json({ data })
  } catch (error) {
    res.status(400).json(error)
  }
}

export const getOneProduct = async (req, res) => {
  try {
    const data = await Product.findById(req.params.id).populate({
      path: 'bids',
      populate: { path: 'user', select: 'email' },
    })

    if (!data) {
      return res.status(404).json({ message: 'Not found' })
    }

    res.status(200).json({ data })
  } catch (error) {
    res.status(400).json(error)
  }
}

export const createProduct = async (req, res) => {
  try {
    const { error } = createValidator.validate(req.body)

    if (error) {
      const message = error.details.map((err) => err.message)
      return res.status(400).json({ message })
    }

    const { bidTime, startAt } = req.body

    let endAt = null

    if (bidTime && startAt)
      endAt = new Date(startAt).getTime() + bidTime * 60 * 1000

    const dataCreate = req.body

    if (endAt) dataCreate.endAt = new Date(endAt)

    const data = await Product.create(dataCreate)

    res.status(200).json({ message: 'Product added successfully', data })
  } catch (error) {
    res.status(400).json(error)
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { error } = updateValidator.validate(req.body)

    if (error) {
      const message = error.details.map((err) => err.message)
      return res.status(400).json({ message })
    }

    const { bidTime, startAt } = req.body

    let endAt = null

    if (bidTime && startAt)
      endAt = new Date(startAt).getTime() + bidTime * 60 * 1000

    const dataUpdate = req.body

    if (endAt) dataUpdate.endAt = new Date(endAt)

    const data = await Product.findByIdAndUpdate(req.params.id, dataUpdate, {
      new: true,
    })

    res.status(200).json({ message: 'Product update successful', data })
  } catch (error) {
    res.status(400).json(error)
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const data = await Product.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Product deleted successfully', data })
  } catch (error) {
    res.status(400).json(error)
  }
}
