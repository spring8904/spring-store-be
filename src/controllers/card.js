import Card from '../models/Card'

export const getCard = async (req, res) => {
  const { userId } = req.params
  try {
    const data = await Card.findOne({ user: userId }).populate(
      'products.product',
    )
    res.status(200).json(data)
  } catch (error) {
    res.status(400).json(error)
  }
}

export const addToCard = async (req, res) => {
  const { userId } = req.params
  const { productId, quantity } = req.body
  try {
    let card = await Card.findOne({
      user: userId,
    })

    if (!card)
      card = await Card.create({
        user: userId,
        products: [],
      })

    const productInCard = card.products.find(
      (p) => p.product.toString() === productId,
    )

    if (productInCard) productInCard.quantity += quantity
    else {
      card.products.push({ product: productId, quantity })
    }

    await card.save()
    res.status(201).json(card)
  } catch (error) {
    res.status(400).json(error)
  }
}

export const updateQuantity = async (req, res) => {
  const { userId, productId } = req.params
  const { quantity } = req.body
  try {
    const card = await Card.findOne({ user: userId })

    const productInCard = card.products.find(
      (p) => p.product.toString() == productId,
    )

    if (!productInCard) return res.status(404).json({ message: 'Not found' })

    productInCard.quantity = quantity

    await card.save()
    res.status(200).json(card)
  } catch (error) {
    res.status(400).json(error)
  }
}

export const removeFromCard = async (req, res) => {
  const { userId, productId } = req.params
  try {
    const card = await Card.findOne({ user: userId })

    const productInCard = card.products.find(
      (p) => p.product.toString() == productId,
    )

    if (!productInCard) return res.status(404).json({ message: 'Not found' })

    card.products = card.products.filter(
      (p) => p.product.toString() !== productId,
    )

    await card.save()
    res.status(200).json(card)
  } catch (error) {
    res.status(400).json(error)
  }
}
