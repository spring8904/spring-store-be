import deepEqual from 'deep-equal'
import Product from '../models/Product'
import { getPublicIdFromUrl } from '../utils'
import { createValidator, updateValidator } from '../validations/product'
import cloudinary from '../config/cloudinary'

export const getProducts = async (req, res) => {
  try {
    const data = await Product.find()
    res.status(200).json({ data })
  } catch (error) {
    res.status(400).json(error)
  }
}

export const getProductById = async (req, res) => {
  try {
    const data = await Product.findById(req.params.id)
    if (!data) return res.status(404).json({ message: 'Not found' })

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
    if (req.body.thumbnail)
      await cloudinary.uploader.destroy(getPublicIdFromUrl(req.body.thumbnail))

    if (req.body.images?.length) {
      const publicIds = req.body.images.map((image) =>
        getPublicIdFromUrl(image),
      )
      await cloudinary.api.delete_resources(publicIds)
    }

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
    if (!product) return res.status(404).json({ message: 'Not found' })

    // eslint-disable-next-line no-unused-vars
    const sanitizedProduct = (({ _id, updatedAt, key, createdAt, ...rest }) =>
      rest)(product)

    if (deepEqual(sanitizedProduct, req.body))
      return res.status(200).json({ message: 'No changes detected' })

    if (req.body.thumbnail !== product.thumbnail)
      await cloudinary.uploader.destroy(getPublicIdFromUrl(product.thumbnail))

    const oldImages = product.images
    const newImages = req.body.images

    const toBeDeleted = oldImages
      .filter((image) => !newImages.includes(image))
      .map((image) => getPublicIdFromUrl(image))

    if (toBeDeleted.length) await cloudinary.api.delete_resources(toBeDeleted)

    const data = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    res.status(200).json({ message: 'Product update successful', data })
  } catch (error) {
    const product = await Product.findById(req.params.id)

    if (req.body.thumbnail !== product.thumbnail)
      await cloudinary.uploader.destroy(getPublicIdFromUrl(req.body.thumbnail))

    const oldImages = product.images
    const newImages = req.body.images

    const toBeDeleted = newImages
      .filter((image) => !oldImages.includes(image))
      .map((image) => getPublicIdFromUrl(image))

    if (toBeDeleted.length) await cloudinary.api.delete_resources(toBeDeleted)

    res.status(400).json(error)
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Not found' })

    if (product?.thumbnail)
      await cloudinary.uploader.destroy(getPublicIdFromUrl(product.thumbnail))

    if (product?.images.length) {
      const toBeDeleted = product.images.map((image) =>
        getPublicIdFromUrl(image),
      )
      await cloudinary.api.delete_resources(toBeDeleted)
    }

    const data = await Product.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Product deleted successfully', data })
  } catch (error) {
    res.status(400).json(error)
  }
}
