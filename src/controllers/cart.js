import { StatusCodes } from 'http-status-codes'
import Cart from '../models/Cart'
import {
  getCartByUserIdValidator,
  productCartOperationValidator,
  removeProductFromCartValidator,
} from '../validations/cart'

export const getCartByUserId = async (req, res) => {
  const { error } = getCartByUserIdValidator.validate(req.params)
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.details[0].message })
  }

  const { userId } = req.params
  try {
    const data = await Cart.findOne({ user: userId }).populate(
      'products.product',
    )
    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Cart not found' })
    }
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
}

export const addProductToCart = async (req, res) => {
  const { error } = productCartOperationValidator.validate(req.body)

  if (error) {
    const message = error.details.map((err) => err.message)
    return res.status(StatusCodes.BAD_REQUEST).json({ message })
  }

  const { userId } = req.body
  const { productId, quantity } = req.body
  try {
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
        (p) => p.product.toString() == productId,
      )

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
  const { error } = productCartOperationValidator.validate(req.body)

  if (error) {
    const message = error.details.map((err) => err.message)
    return res.status(StatusCodes.BAD_REQUEST).json({ message })
  }

  const { userId, productId } = req.body
  const { quantity } = req.body
  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      'products.product',
    )

    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Cart not found' })
    }

    const productInCart = cart.products.find(
      (p) => p.product.id.toString() == productId,
    )

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
  const { error } = removeProductFromCartValidator.validate(req.body)

  if (error) {
    const message = error.details.map((err) => err.message)
    return res.status(StatusCodes.BAD_REQUEST).json({ message })
  }

  const { userId, productId } = req.body

  try {
    const cart = await Cart.findOne({ user: userId }).populate(
      'products.product',
    )

    const productInCart = cart.products.find(
      (p) => p.product.toString() == productId,
    )

    if (!productInCart)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found' })

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId,
    )

    await cart.save()

    res.status(StatusCodes.OK).json(cart)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
}
