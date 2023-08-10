const jwt = require('jsonwebtoken');
const config = require('./secretKey');

function verifyToken(req, res, next) {
  const token = req.headers.authorization; // Retrieve authorization header's content
  if (!token || !token.includes('Bearer')) {
    res.status(403);
    return res.send({ auth: false, message: 'Not authorized!' });
  } else {
    const tokenValue = token.split('Bearer ')[1]; // Obtain the token's value
    jwt.verify(tokenValue, config.key, function (err, decoded) {
      if (err) {
        console.log('hello not auth')
        res.status(403);
        return res.send({ auth: false, message: 'Not authorized!' });
      } else {
        req.userId = decoded.id; // Decode the user ID and store it in req for use
        req.role = decoded.role; // Decode the role and store it in req for use
        
        next();
      }
    });
  }
}

module.exports = verifyToken;