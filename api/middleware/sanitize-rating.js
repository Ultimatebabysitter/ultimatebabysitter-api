module.exports = (req, res, next) => {
  try {
    // sanitize all the fields
    const { body } = req;
    for (const [key, value] of Object.entries(body)) {
      if (value) {
        body[key] = req.sanitize(value)
      }
    }
    next()
  } catch (error) {
    return res.status(400).json({message: error})
  }
}
