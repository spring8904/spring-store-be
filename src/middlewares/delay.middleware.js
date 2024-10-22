const delay = (req, res, next) => {
  console.log('Delaying request...')
  setTimeout(() => {
    console.log('Request delayed')
    next()
  }, 5000)
}

export default delay
