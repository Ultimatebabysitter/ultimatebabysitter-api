module.exports = (req, res, next) => {
  try {
    if (req.userData.type === 'admin') {
      // admins can edit anything
    } else if (req.userData.type === 'babysitter' || req.userData.type === 'parent') {
      // checks that the babysitter or parent is only changing thier own data
      // req.userData.userId is the authenticated user's id
      // req.params.userId is the param of the endpoint
      if (req.userData.userId === req.params.userId) {
        // user is editing themselves
      } else {
        return res.status(401).json({message: 'auth failed'})
      }
    }
    next()
  } catch (error) {
    return res.status(401).json({message: 'auth failed'})
  }
}
