const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userData = decoded
    // Example userData
    /*
    { email: 'usersemail@gmail.com',
      zip: '12345',
      userId: '7fyr87yf87y2872yr9827y72y',
      iat: 1527357444,
      exp: 1527361044 }
    */
    next()
  } catch (error) {
    return res.status(401).json({message: 'auth failed'})
  }
}
