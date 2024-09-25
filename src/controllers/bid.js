import Bid from '../models/Bid'
import Product from '../models/Product'

export const createBid = async (req, res) => {
  try {
    const data = await Bid.create(req.body)

    await Product.findByIdAndUpdate(req.body.product, {
      bids: [...res.body.bids, data.id],
      bidPriceMax:
        req.body.price > res.body.bidPriceMax
          ? req.body.price
          : res.body.bidPriceMax,
    })

    res.status(200).json({ message: 'Create bid successfully', data })
  } catch (error) {
    res.status(400).json(error)
  }
}

export const updateBid = async (req, res) => {
  try {
    const data = await Bid.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (!data) {
      return res.status(404).json({ message: 'Bid not found' })
    }

    res.status(200).json({ message: 'Update bid successfully', data })
  } catch (error) {
    res.status(400).json(error)
  }
}
