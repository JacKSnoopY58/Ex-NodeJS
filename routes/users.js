var express = require('express');
var router = express.Router();
var usersSchema = require('../models/users.model')
/* GET users listing. */
router.post('/', async function(req, res, next) {
  let { name, age } = req.body
try{
  let user = new usersSchema({
    name: name,
    age: age
  })

  await user.save()

  res.status(201).send({
    status: 201,
    message: "Create Success.",
    data: null
  });
}catch (error){
  console.error(error);
    res.status(500).send({
      status: 500,
      message: "Create Fail"
    });
}

});


router.put('/update/:id', async function(req, res, next) {
  const id = req.params.id;
  const { name, age } = req.body;

  try {
    let user = await usersSchema.findByIdAndUpdate(id, { name, age } );

    res.status(200).send({
      status: 200,
      message: "Update Success.",
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Update Fail"
    });
  }
});



router.get('/:name', async function(req, res, next) {
  let name = req.params.name;
  //console.log(name)
  try {                                     
    const users = await usersSchema.findOne({name:name}); 
    
    res.status(200).send({
      status: 200,
      message: "Success.",
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal Server Error"
    });
  }
});


router.get('/', async function(req, res, next) {
  try {
    const users = await usersSchema.find({});
    
    res.status(200).send({
      status: 200,
      message: "Success.",
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal Server Error"
    });
  }
});

router.get('/test', function(req, res, next) {
  const objec = { name: "test", age: "20", }
  res.send(objec);
});



router.get('/test2', function(req, res, next) {
  const objec = { name: "test", age: "20",}
  res.render('index', { title: 'tes2' });
  res.send(objec);
});


module.exports = router;
