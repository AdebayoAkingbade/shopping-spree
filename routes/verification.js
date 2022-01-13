const jwt = require("jsonwebtoken")



const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.SECRET_JWT, (err, user) => {
        if (err) res.status(403).json("Invalid Token!");
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("Not Authorized!");
    }
  };  

const verifyTokenAndAuth = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("Invalid id!");
      }
    });
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("Not an admin!");
      }
    });
}

module.exports = { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin }