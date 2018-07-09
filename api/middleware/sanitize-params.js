module.exports = (req, res, next) => {
  try {
    // sanitize all the params
    const { params } = req;
    for (const [key, value] of Object.entries(params)) {
      params[key] = req.sanitize(value)
    }
    next()
  } catch (error) {
    return res.status(400).json({message: error})
  }
}
