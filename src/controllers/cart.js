import { StatusCodes } from 'http-status-codes'
import Cart from '../models/Cart'
import {
  getCartByUserIdSchema,
  productCartOperationSchema,
  removeProductFromCartSchema,
} from '../validations/cart'
import Product from '../models/Product'
import { handleValidationError } from '../utils'

export const getCartByUserId = async (req, res) => {
  const { error } = getCartByUserIdSchema.validate(req.params)
  if (error) return handleValidationError(error, res)

  const { userId } = req.params
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
  const { error } = productCartOperationSchema.validate({
    ...req.params,
    ...req.body,
  })
  if (error) return handleValidationError(error, res)

  const { userId } = req.params
  const { productId, quantity } = req.body
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
  const { error } = productCartOperationSchema.validate({
    ...req.params,
    ...req.body,
  })
  if (error) return handleValidationError(error, res)

  const { userId, productId } = req.params
  const { quantity } = req.body
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
  const { error } = removeProductFromCartSchema.validate(req.params)

  if (error) return handleValidationError(error, res)

  const { userId, productId } = req.params

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
