import { getPublicIdFromUrl } from '../../utils/cloudinary'
import Product from '../models/Product'
import { createValidator, updateValidator } from '../validations/product'
import { v2 as cloudinary } from 'cloudinary'

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
    const data = await Product.findById(req.params.id)

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

    const data = await Product.create(req.body)

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

    const product = await Product.findById(req.params.id)

    if (req.body.thumbnail && req.body.thumbnail !== product.thumbnail) {
      cloudinary.uploader.destroy(getPublicIdFromUrl(product.thumbnail))
    }

    if (req.body.images) {
      const oldImages = product.images
      const newImages = req.body.images

      const toBeDeleted = oldImages
        .filter((image) => !newImages.includes(image))
        .map((image) => getPublicIdFromUrl(image))

      cloudinary.api.delete_resources(toBeDeleted)
    }

    const data = await Product.findByIdAndUpdate(req.params.id, req.body, {
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

    if (data?.thumbnail)
      cloudinary.uploader.destroy(getPublicIdFromUrl(data.thumbnail))

    if (data?.images) {
      const toBeDeleted = data.images.map((image) => getPublicIdFromUrl(image))
      cloudinary.api.delete_resources(toBeDeleted)
    }

    res.status(200).json({ message: 'Product deleted successfully', data })
  } catch (error) {
    res.status(400).json(error)
  }
}
