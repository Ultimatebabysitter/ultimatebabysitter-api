module.exports = (req, res, next) => {
  try {
    // verify user post data is babysitter or parent
    if (req.body.type !== 'babysitter' && req.body.type !== 'parent') {
      return res.status(400).json({message: 'user type must be babysitter or parent'})
    }
    next()
  } catch (error) {
    return res.status(400).json({message: error})
  }
}
