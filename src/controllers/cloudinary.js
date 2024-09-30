import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
})

export const deleteImage = async (req, res) => {
  const { publicId } = req.params

  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return res
      .status(200)
      .json({ message: 'Image deleted successfully', result })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete image', error })
  }
}
