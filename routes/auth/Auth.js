const jwt = require("jsonwebtoken");

async function Auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        status: 401,
        message: "No token provided",
      });
    }
    jwt.verify(token, process.env.SECRETTKEY, (err, decodedToken) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(401).send({
          status: 401,
          message: "Failed to authenticate token",
        });
      }

      req.role = decodedToken.role;
      req.uid = decodedToken.id;
      req.username = decodedToken.username;
      next();
    });
  } catch (error) {
    console.error("Authentication failed:", error);
    return res.status(401).send({
      status: 401,
      message: "Failed to authenticate token",
    });
  }
}

module.exports = Auth;
