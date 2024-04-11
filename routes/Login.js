var express = require('express');
var router = express.Router();
var Login = require('./auth/Login');
router.post("/", async function (req, res, next) {
  try {

    let { username, password } = req.body;

    let logincheck = await Login(username, password);
 
    if (logincheck.success) {
        res.status(200).send({
          status: 200,
          message: "Login Successful",
          token: logincheck.token
        });
      } else {
        
        res.status(401).send({
          status: 401,
          message: "Unauthorized",
        });
      }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
