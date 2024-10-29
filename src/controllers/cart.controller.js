import { StatusCodes } from 'http-status-codes'
import Cart from '../models/Cart'
import Product from '../models/Product'
import {
  getCartByUserIdSchema,
  productCartOperationSchema,
  removeProductFromCartSchema,
} from '../schemas/cart.schema'
import { handleValidationError } from '../utils'

export const getCartByUserId = async (req, res) => {
  const userId = req.user?.id
  const { error } = getCartByUserIdSchema.validate({ userId })
  if (error) return handleValidationError(error, res)

  try {
    let cart = await Cart.findOne({ user: userId }).populate('products.product')
    if (!cart)
      cart = new Cart({
        user: userId,
        products: [],
      })
    await cart.save()

    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
}

export const addProductToCart = async (req, res) => {
  const userId = req.user?.id

  const { productId, quantity } = req.body
  const { error } = productCartOperationSchema.validate({
    userId,
    productId,
    quantity,
  })
  if (error) return handleValidationError(error, res)

  try {
    const product = await Product.findById(productId)
    if (!product)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found' })

    if (product.status !== 'published')
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Product is not available' })

    const productQuantity = product.quantity

    if (productQuantity.quantity < quantity)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Not enough stock' })

    let cart = await Cart.findOne({
      user: userId,
    })

    if (!cart)
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }],
      })
    else {
      const productInCart = cart.products.find(
        (p) => p.product.toString() === productId,
      )

      if (
        productInCart &&
        productInCart.quantity + quantity > productQuantity.quantity
      ) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Not enough stock' })
      }

      if (productInCart) productInCart.quantity += quantity
      else cart.products.push({ product: productId, quantity })
    }

    await cart.save()

    cart = await Cart.findOne({ user: userId }).populate('products.product')

    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

export const updateProductQuantity = async (req, res) => {
  const userId = req.user?.id
  const { productId, quantity } = req.body

  const { error } = productCartOperationSchema.validate({
    userId,
    productId,
    quantity,
  })
  if (error) return handleValidationError(error, res)

  try {
    const productQuantity = await Product.findById(productId).select('quantity')

    if (!productQuantity)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found' })

    if (productQuantity.quantity < quantity)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Not enough stock' })

    let cart = await Cart.findOne({ user: userId }).populate('products.product')
    if (!cart)
      cart = new Cart({
        user: userId,
        products: [],
      })
    await cart.save()

    const productInCart = cart.products.find((p) => p.product.id === productId)

    if (!productInCart)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found' })

    productInCart.quantity = quantity

    await cart.save()
    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
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
        .json({ message: 'Product not found' })

    cart.products = cart.products.filter((p) => p.product.id !== productId)

    await cart.save()

    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
}
