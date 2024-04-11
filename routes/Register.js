var express = require('express');
var router = express.Router();
var usersSchema = require('../models/users.model')

router.post("/", async function (req, res, next) {
  let { username, 
        password, 
        name, 
        role } = req.body;
  try {
    let user = new usersSchema({
      username: username,
      password: password,
      name: name,
      role: role
      
    });

    await user.save();

    res.status(201).send({
      status: 201,
      message: "Create Success.",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Create Fail",
    });
  }
});

module.exports = router;
