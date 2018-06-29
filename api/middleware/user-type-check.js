module.exports = (req, res, next) => {
  try {
    // verify user post data doesn't have a type of admin
    if (req.body.type === "admin") {
      return res.status(401).json({message: 'cannot create user without type babysitter or parent'})
    }
    next()
  } catch (error) {
    return res.status(401).json({message: 'cannot create user without type babysitter or parent'})
  }
}
