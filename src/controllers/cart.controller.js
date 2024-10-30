import { StatusCodes } from 'http-status-codes'
import Cart from '../models/Cart'
import Product from '../models/Product'
import {
  addProductToCartSchema,
  getCartSchema,
  removeProductFromCartSchema,
  updateProductQuantitySchema,
} from '../schemas/cart.schema'
import { handleValidationError } from '../utils'

const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('products.product')
  if (!cart) {
    cart = new Cart({ user: userId, products: [] })
    await cart.save()
  }
  return cart
}

export const getCart = async (req, res) => {
  const userId = req.user?.id
  const { error } = getCartSchema.validate({ userId })
  if (error) return handleValidationError(error, res)

  try {
    const cart = await findOrCreateCart(userId)
    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

export const addProductToCart = async (req, res) => {
  const userId = req.user?.id
  const { productId } = req.body
  const { error } = addProductToCartSchema.validate({
    userId,
    productId,
  })
  if (error) return handleValidationError(error, res)

  try {
    const product = await Product.findById(productId)
    if (!product || product.status !== 'published')
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not available' })

    const cart = await findOrCreateCart(userId)
    const productInCart = cart.products.find((p) => p.product.id === productId)

    if (productInCart) {
      if (productInCart.quantity + 1 > product.quantity) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Not enough stock' })
      }

      productInCart.quantity += 1
    } else cart.products.push({ product: productId, quantity: 1 })

    await cart.save()
    res.status(StatusCodes.OK).json(await findOrCreateCart(userId))
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

export const updateProductQuantity = async (req, res) => {
  const userId = req.user?.id
  const { productId, quantity } = req.body

  const { error } = updateProductQuantitySchema.validate({
    userId,
    productId,
    quantity,
  })
  if (error) return handleValidationError(error, res)

  try {
    const product = await Product.findById(productId)

    if (!product || product.status !== 'published')
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found' })

    if (product.quantity < quantity)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Not enough stock' })

    const cart = await findOrCreateCart(userId)
    const productInCart = cart.products.find((p) => p.product.id === productId)

    if (!productInCart)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not in cart' })

    productInCart.quantity = quantity

    await cart.save()
    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

export const removeProductFromCart = async (req, res) => {
  const userId = req.user?.id
  const { productId } = req.params
  const { error } = removeProductFromCartSchema.validate({ userId, productId })

  if (error) return handleValidationError(error, res)

  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      'products.product',
    )

    const productInCart = cart.products.find((p) => p.product.id === productId)

    if (!productInCart)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not in cart' })

    cart.products = cart.products.filter((p) => p.product.id !== productId)

    await cart.save()

    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}
