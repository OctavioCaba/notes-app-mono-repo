const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authorization = req.get('authorization');
 
  let token = null;
  if(authorization && authorization.toLocaleLowerCase().startsWith('bearer')) {
    token = authorization.substring(7);
  }

  let decodedToken = {};
  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    console.log(error);
  }

  if(!token || !decodedToken.id) {
    return res.send(401).json({ error: 'token missing or invalid' });
  }

  const { id: userId } = decodedToken;
  req.userId = userId;
  next();
};
