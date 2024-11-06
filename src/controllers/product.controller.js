import deepEqual from 'deep-equal'
import { StatusCodes } from 'http-status-codes'
import slugify from 'slugify'
import cloudinary from '../config/cloudinary.config.js'
import Product from '../models/Product.js'
import { productSchema } from '../schemas/product.schema.js'
import getPublicIdFromUrl from '../utils/helpers/getPublicIdFromUrl.js'

export const getProducts = async (req, res) => {
  try {
    const data = await Product.find()
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

export const getProductBySlug = async (req, res) => {
  const { slug } = req.params
  try {
    const data = await Product.findOne({ slug })
    if (!data)
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })

    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

const getImagesData = (req) => {
  const thumbnail = req.files?.['thumbnail']
    ? req.files['thumbnail'][0].path
    : undefined

  const images = req.files?.['images']
    ? Array.isArray(req.files['images'])
      ? req.files['images'].map((image) => image.path)
      : [req.files['images'].path]
    : []

  return { thumbnail, images }
}

const deleteImagesFromCloudinary = async (images) => {
  if (images?.length) {
    const publicIds = images.map((image) => getPublicIdFromUrl(image))
    await cloudinary.api.delete_resources(publicIds)
  }
}

const deleteThumbAndImages = async (thumbnail, images, pThumbnail = '') => {
  if (thumbnail && thumbnail !== pThumbnail)
    await cloudinary.uploader.destroy(getPublicIdFromUrl(thumbnail))
  await deleteImagesFromCloudinary(images)
}

export const createProduct = async (req, res) => {
  const { thumbnail, images } = getImagesData(req)
  const product = { ...req.body, thumbnail, images }

  const { error, value } = productSchema.validate(product)

  if (error) {
    const message = error.details.map((err) => err.message)
    await deleteThumbAndImages(thumbnail, images)
    return res.status(StatusCodes.BAD_REQUEST).json({ message })
  }

  try {
    const existingProduct = await Product.findOne({ title: product.title })
    if (existingProduct) {
      await deleteThumbAndImages(thumbnail, images)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Product already exists' })
    }

    const slug = slugify(value.title, { lower: true })

    const data = await Product.create({ ...product, slug })
    res.status(StatusCodes.CREATED).json(data)
  } catch (error) {
    await deleteThumbAndImages(thumbnail, images)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

export const updateProduct = async (req, res) => {
  const { thumbnail, images } = getImagesData(req)

  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      await deleteThumbAndImages(thumbnail, images)
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })
    }

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

    const { error } = productSchema.validate(dataUpdate)
    if (error) {
      const message = error.details.map((err) => err.message)
      await deleteThumbAndImages(thumbnail, images, product.thumbnail)
      return res.status(StatusCodes.BAD_REQUEST).json({ message })
    }

    // eslint-disable-next-line no-unused-vars
    const { _id, updatedAt, createdAt, slug, ...rest } = product._doc

    if (deepEqual(rest, dataUpdate))
      return res.status(StatusCodes.OK).json({ message: 'No changes detected' })

    if (thumbnail && thumbnail !== product.thumbnail)
      await cloudinary.uploader.destroy(getPublicIdFromUrl(product.thumbnail))

    const toBeDeleted = product.images.filter(
      (image) => !dataUpdate.images.includes(image),
    )

    await deleteImagesFromCloudinary(toBeDeleted)

    const data = await Product.findByIdAndUpdate(req.params.id, dataUpdate, {
      new: true,
    })

    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    await deleteThumbAndImages(thumbnail, images)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product)
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })

    await deleteThumbAndImages(product.thumbnail, product.images)

    const data = await Product.findByIdAndDelete(req.params.id)

    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}
