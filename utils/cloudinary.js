export const getPublicIdFromUrl = (url) => {
  const regex = /\/upload\/(?:v\d+\/)?([^.]+)/
  const matches = url.match(regex)
  return matches ? matches[1] : null
}
