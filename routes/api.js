var express = require("express");
var router = express.Router();
var usersSchema = require('../models/users.model');
var productSchema = require('../models/product.model');
var orderSchema = require('../models/order.model');

router.put('/approve/:id', async function(req, res, next) {
  const id = req.params.id;
  const role = req.role;

 if(role === 'admin'){
  try {
    let user = await usersSchema.findByIdAndUpdate(id, { isActive: true });
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "User not found."
      });
    }
    let useredit = await usersSchema.findById({_id:id});
    res.status(200).send({
      status: 200,
      message: "Approve Success.",
      data: useredit
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Approve Fail"
    });
  }
 }else {
  res.status(403).send({
    status: 403,
    message: "Accept Denied"
  });
 }
});

router.get("/product", async function (req, res, next) {
  try {
    const product = await productSchema.find({})

    res.status(200).send({
      status: 200,
      message: "Success",
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

router.post("/product", async function (req, res, next) {
  let { Pname, 
        stock, 
        price} = req.body;
const role = req.role;

 if(role === 'admin'){
  try {
    if(Pname || stock || price){
      let product = new productSchema({
        Pname: Pname,
        stock: stock,
        price: price
        
      });
  
      await product.save();

      res.status(201).send({
        status: 201,
        message: "Create Success.",
        data: product,
      });
    }else{
      res.status(500).send({
        status: 500,
        message: "Create Fail",
      });
    }

  } catch (error) {

    res.status(500).send({
      status: 500,
      message: "Create Fail",
    });
  }
}else{
  res.status(403).send({
    status: 403,
    message: "Accept Denied"
  });
}
});

router.put('/product/:id', async function(req, res, next) {
  const id = req.params.id;
  const role = req.role;

  let { Pname, stock, price } = req.body;

  if (role === 'admin') {
    try {
      let product = await productSchema.findById(id);

      if (!product) {
        return res.status(404).send({
          status: 404,
          message: "Product not found."
        });
      }
      if(stock <= 0){
        product.stock = stock
      }else{
        product.stock += stock; 
      }
      
      product.Pname = Pname
      product.price = price

      await product.save();

      res.status(200).send({
        status: 200,
        message: "Edit Product Success.",
        data: product
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Internal Server Error."
      });
    }
  } else {
    res.status(403).send({
      status: 403,
      message: "Access Denied."
    });
  }
});

router.delete('/product/:id', async function(req, res, next) {
  const id = req.params.id;
  const role = req.role; 
  if (role === 'admin') {
    try {

      let product = await productSchema.findByIdAndDelete(id);
      
      if (!product) {
        return res.status(404).send({
          status: 404,
          message: "Product not found."
        });
      }

      res.status(200).send({
        status: 200,
        message: "Delete Product Success."
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Delete Product Failed."
      });
    }
  } else {
    res.status(403).send({
      status: 403,
      message: "Access Denied"
    });
  }
});

router.post("/products/:id/orders", async function (req, res, next) {
  const Amount = req.body.Amount;
  const Pid = req.params.id;

  const uid = req.uid;
  const username = req.username;

  try {
    if (Amount > 0) {
      let product = await productSchema.findById(Pid);

      if (product) {
        if (Amount <= product.stock) {
          let order = new orderSchema({
            userId: uid,
            productId: product._id,
            username: username,
            Pname: product.Pname,
            Amount: Amount,
            price: product.price,
            total: product.price * Amount
          });

          let addorder = await order.save();

          if (addorder) {
            let stock = product.stock - Amount; 
            let updatedProduct = await productSchema.findByIdAndUpdate(Pid, { stock: stock }); 
            res.status(201).send({
              status: 201,
              message: "Create Success.",
              data: order,
            });
          }
        } else {
          res.status(500).send({
            status: 500,
            message: "OUT OF STOCK",
            data: "Available Stock: " + product.stock,
          });
        }
      } else {
        res.status(404).send({
          status: 404,
          message: "Product not found",
        });
      }
    } else {
      res.status(400).send({
        status: 400,
        message: "Invalid Amount",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Create Fail",
    });
  }
});

router.get("/orders", async function (req, res, next) {
  try {
    const order = await orderSchema.find({})

    res.status(200).send({
      status: 200,
      message: "Success",
      data: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

router.get("/products/:id/orders", async function (req, res, next) {
  const Pid = req.params.id;
  try {
    const order = await orderSchema.find({productId:Pid});

    res.status(200).send({
      status: 200,
      message: "Success",
      data: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
}); 

module.exports = router;