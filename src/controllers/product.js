import deepEqual from 'deep-equal'
import Product from '../models/Product'
import { getPublicIdFromUrl } from '../utils'
import { createValidator, updateValidator } from '../validations/product'
import cloudinary from '../config/cloudinary'

export const getProducts = async (req, res) => {
  try {
    const data = await Product.find()
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json(error)
  }
}

export const getProductBySlug = async (req, res) => {
  const { slug } = req.params
  try {
    const data = await Product.findOne({ slug })
    if (!data) return res.status(404).json({ message: 'Not found' })

    res.status(200).json(data)
  } catch (error) {
    res.status(400).json(error)
  }
}

const getImagesData = (req) => {
  const thumbnail = req.files?.['thumbnailFile']
    ? req.files['thumbnailFile'][0].path
    : null

  const images = req.files?.['imagesFile']
    ? Array.isArray(req.files['imagesFile'])
      ? req.files['imagesFile'].map((image) => image.path)
      : [req.files['imagesFile'].path]
    : []

  return { thumbnail, images }
}

const deleteImagesFromCloudinary = async (images) => {
  if (images?.length) {
    const publicIds = images.map((image) => getPublicIdFromUrl(image))
    await cloudinary.api.delete_resources(publicIds)
  }
}

export const createProduct = async (req, res) => {
  const { thumbnail, images } = getImagesData(req)
  const product = { ...req.body, thumbnail, images }

  try {
    const { error } = createValidator.validate(product)

    if (error) {
      const message = error.details.map((err) => err.message)
      if (thumbnail)
        await cloudinary.uploader.destroy(getPublicIdFromUrl(thumbnail))

      await deleteImagesFromCloudinary(images)
      return res.status(400).json({ message })
    }

    const existingProduct = await Product.findOne({ title: product.title })
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already exists' })
    }

    const data = await Product.create(product)
    res.status(201).json(data)
  } catch (error) {
    if (thumbnail)
      await cloudinary.uploader.destroy(getPublicIdFromUrl(thumbnail))
    await deleteImagesFromCloudinary(images)
    res.status(400).json(error)
  }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Not found' })

    const { thumbnail, images } = getImagesData(req)
    const oldImages = req.body.oldImages
      ? Array.isArray(req.body.oldImages)
        ? req.body.oldImages
        : [req.body.oldImages]
      : []

    delete req.body.oldImages

    const dataUpdate = {
      ...req.body,
      thumbnail: thumbnail || product.thumbnail,
      images: images.length ? [...images, ...oldImages] : oldImages,
    }

    const { error } = updateValidator.validate(dataUpdate)
    if (error) {
      const message = error.details.map((err) => err.message)
      if (thumbnail && thumbnail !== product.thumbnail) {
        await cloudinary.uploader.destroy(getPublicIdFromUrl(thumbnail))
      }

      await deleteImagesFromCloudinary(images)
      return res.status(400).json({ message })
    }

    // eslint-disable-next-line no-unused-vars
    const { _id, updatedAt, createdAt, slug, ...rest } = product._doc

    if (deepEqual(rest, dataUpdate))
      return res.status(200).json({ message: 'No changes detected' })

    if (thumbnail && thumbnail !== product.thumbnail)
      await cloudinary.uploader.destroy(getPublicIdFromUrl(product.thumbnail))

    const toBeDeleted = product.images.filter(
      (image) => !dataUpdate.images.includes(image),
    )

    await deleteImagesFromCloudinary(toBeDeleted)

    const data = await Product.findByIdAndUpdate(req.params.id, dataUpdate, {
      new: true,
    })

    res.status(200).json(data)
  } catch (error) {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Not found' })

    const { thumbnail, images } = getImagesData(req)
    if (thumbnail && thumbnail !== product.thumbnail) {
      await cloudinary.uploader.destroy(getPublicIdFromUrl(thumbnail))
    }
    await deleteImagesFromCloudinary(images)
    res.status(400).json(error)
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Not found' })

    if (product?.thumbnail)
      await cloudinary.uploader.destroy(getPublicIdFromUrl(product.thumbnail))

    await deleteImagesFromCloudinary(product.images)

    const data = await Product.findByIdAndDelete(req.params.id)

    res.status(200).json(data)
  } catch (error) {
    res.status(400).json(error)
  }
}
