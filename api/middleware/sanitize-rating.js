module.exports = (req, res, next) => {
  try {
    // req.body.rating = req.sanitize(req.body.rating)
    // req.body.user = req.sanitize(req.body.user)
    // req.body.reporting_user = req.sanitize(req.body.reporting_user)
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
