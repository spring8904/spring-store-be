import deepEqual from 'deep-equal'
import Product from '../models/Product'
import { getPublicIdFromUrl } from '../utils'
import { createValidator, updateValidator } from '../validations/product'
import cloudinary from '../config/cloudinary'
import { StatusCodes } from 'http-status-codes'
import slugify from 'slugify'

export const getProducts = async (req, res) => {
  try {
    const data = await Product.find()
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
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
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
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
    const { error, value } = createValidator.validate(product)

    if (error) {
      const message = error.details.map((err) => err.message)
      if (thumbnail)
        await cloudinary.uploader.destroy(getPublicIdFromUrl(thumbnail))

      await deleteImagesFromCloudinary(images)
      return res.status(StatusCodes.BAD_REQUEST).json({ message })
    }

    const existingProduct = await Product.findOne({ title: product.title })
    if (existingProduct) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Product already exists' })
    }

    const slug = slugify(value.title, { lower: true })

    const data = await Product.create({ ...product, slug })
    res.status(StatusCodes.CREATED).json(data)
  } catch (error) {
    if (thumbnail)
      await cloudinary.uploader.destroy(getPublicIdFromUrl(thumbnail))
    await deleteImagesFromCloudinary(images)
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product)
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })

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
    const product = await Product.findById(req.params.id)
    if (!product)
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })

    const { thumbnail, images } = getImagesData(req)
    if (thumbnail && thumbnail !== product.thumbnail) {
      await cloudinary.uploader.destroy(getPublicIdFromUrl(thumbnail))
    }
    await deleteImagesFromCloudinary(images)
    res.status(StatusCodes.BAD_REQUEST).json(error)
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product)
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })

    if (product?.thumbnail)
      await cloudinary.uploader.destroy(getPublicIdFromUrl(product.thumbnail))

    await deleteImagesFromCloudinary(product.images)

    const data = await Product.findByIdAndDelete(req.params.id)

    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error)
  }
}
