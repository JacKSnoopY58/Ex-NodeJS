var express = require("express");
var router = express.Router();
var usersSchema = require('../models/users.model');
var productSchema = require('../models/product.model');
var orderSchema = require('../models/order.model');
var cartitemsSchema = require('../models/cartitem.model');
// var cartsSchema = require('../models/cart.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadDirectory = path.resolve(__dirname, '../public/images');
if (!fs.existsSync(uploadDirectory)){
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

router.put('/approve/:id', async function (req, res, next) {
  const id = req.params.id;
  const role = req.role;

  if (role === 'admin') {
    try {
      let user = await usersSchema.findByIdAndUpdate(id, { isActive: true });
      if (!user) {
        return res.status(404).send({
          status: 404,
          message: "User not found."
        });
      }
      let useredit = await usersSchema.findById({ _id: id });
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
  } else {
    res.status(403).send({
      status: 403,
      message: "Accept Denied"
    });
  }
});

router.put('/user/edit', upload.single('image'), async function (req, res, next) {
  const id = req.uid;

  let image = null;
  let { fullname, datebirth, password, email, address } = req.body;

  try {
    if (req.file) {
      image = req.file.filename; 
    }

    let User = await usersSchema.findById(id);

    if (!User) {
      return res.status(404).send({
        status: 404,
        message: "User not found."
      });
    }

    if (req.file && User.Image) {
      fs.unlinkSync(path.join(uploadDirectory, User.Image)); 
    }

    if (image === null) {
      image = User.Image;
    }

    User.fullname = fullname;
    User.dateBirth = datebirth;
    User.password = password;
    User.email = email;
    User.address = address;
    User.Image = image;
    
    await User.save();
    res.status(200).send({
      status: 200,
      message: "Edit User ID: " + id + " Success.",
      data: User
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal Server Error."
    });
  }
});



router.post("/product", upload.single('image'), async function (req, res, next) {
  let { Pname, stock, price } = req.body;
  let image = null;
  
  if(req.file){
    image = req.file.filename; 
  } else {
    return res.status(400).send('No file uploaded');
  }
  
  const role = req.role;
  // console.log(image);
  
  if (role !== 'admin') {
    return res.status(403).send({
      status: 403,
      message: "Access Denied"
    });
  }

  try {
    if (!Pname || !stock || !price || !image) {
      return res.status(400).send({
        status: 400,
        message: "Missing required fields"
      });
    }

    let product = new productSchema({
      Pname: Pname,
      stock: stock,
      price: price,
      Image: image
    });

    await product.save();

    return res.status(201).send({
      status: 201,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);
    if (req.fil && req.file.filename){
      fs.unlinkSync(path.join(uploadDirectory, req.file.filename)); 
    }
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error"
    });
  }
});

router.put('/product/:id', upload.single('image'), async function (req, res, next) {
  const id = req.params.id;
  const role = req.role;
  let image = null;
  let { Pname, stock, price } = req.body;

  try {
    if (req.file) {
      image = req.file.filename; 
    }

    if (role === 'admin') {
      let product = await productSchema.findById(id);

      if (!product) {
        return res.status(404).send({
          status: 404,
          message: "Product not found."
        });
      }


      if (req.file) {
        fs.unlinkSync(path.join(uploadDirectory, product.Image)); 
      }

      if (image === null) {
        image = product.Image;
      }

      product.stock = stock;
      product.Image = image;
      product.Pname = Pname;
      product.price = price;

      await product.save();

      res.status(200).send({
        status: 200,
        message: "Edit Product Success.",
        data: product
      });
    } else {
      res.status(403).send({
        status: 403,
        message: "Access Denied."
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal Server Error."
    });
  }
});

router.delete('/product/:id', async function (req, res, next) {
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
    const order = await orderSchema.find({ productId: Pid });

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

router.post("/product/confirmorder", async function (req, res, next) {
  const uid = req.uid;
  const username = req.username; 

  try {

    const cart = await cartitemsSchema.find({ OrderId: null });

    let total = 0;
    for (const item of cart) {
      total += item.Ptotal;
    }

    const order = new orderSchema({
      userId: uid,
      total: total,
      status: 'paid',
      // timeStamp: new Date() 
    });
    await order.save();

    await cartitemsSchema.updateMany({ OrderId: null }, { OrderId: order._id });

    res.status(200).send({
      status: 200,
      message: "Order confirmed successfully",
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



router.get("/products/carts", async function (req, res, next) {
  try {
    const cart = await cartitemsSchema.find({ OrderId: null });
    res.status(200).send({
      status: 200,
      message: "Success",
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
}); 

router.delete('/product/carts/:id', async function (req, res, next) {
  const id = req.params.id;
  const role = req.role;
  let cart;
  
    try {
      let cartitem = await cartitemsSchema.findById(id);
      
      if (!cartitem) {
        return res.status(404).send({
          status: 404,
          message: "Cart item not found."
        });
      }

      let product = await productSchema.findById(cartitem.productId);
      
      if (!product) {
        return res.status(404).send({
          status: 404,
          message: "Product not found."
        });
      }

      let stock = product.stock + cartitem.Amount;
      product.stock = stock;
      await product.save();

      cart = await cartitemsSchema.findByIdAndDelete(id);
      
      if (!cart) {
        return res.status(404).send({
          status: 404,
          message: "Cart not found."
        });
      }

      return res.status(200).send({
        status: 200,
        message: "Delete Cart Success."
      });
    } catch (error) {
      return res.status(500).send({
        status: 500,
        message: "Delete Cart Failed."
      });
    }

});

router.delete("/deletecart", async function (req, res, next) {
  try {
    const cart = await cartitemsSchema.find({ OrderId: null });
    console.log(cart)
    if (cart.length > 0) {
      console.log(cart);
      for (const item of cart) {
        const cartItem = await cartitemsSchema.findById(item._id);
        console.log("Cart: " + cartItem);
        const product = await productSchema.findById(cartItem.productId);
        product.stock += cartItem.Amount;
        console.log("Stock: " + product.stock);
        await product.save();
        await cartitemsSchema.findByIdAndDelete(item._id);
      }

      return res.status(200).send({
        status: 200,
        message: "Cancel Success",
      });
    } else {
      return res.status(404).send({
        status: 404,
        message: "Cart is empty or not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});



router.post("/product/addcart", async function (req, res, next) {
  const { productId, Amount } = req.body;
  console.log(productId);
  console.log(Amount)

  try {
    if (!productId || !Amount || Amount <= 0) {
      return res.status(400).send({
        status: 400,
        message: "Invalid product ID or amount",
      });
    }

    const product = await productSchema.findById(productId);

    if (!product) {
      return res.status(404).send({
        status: 404,
        message: "Product not found",
      });
    }

    let stock = product.stock - Amount;

    if (stock >= 0) {
      let updatedProduct = await productSchema.findByIdAndUpdate(productId, { stock: stock });

      const cart = new cartitemsSchema({
        productId: productId,
        Amount: Amount,
        Pname: product.Pname,
        Pimg: product.Image,
        price: product.price,
        Ptotal: product.price * Amount
      });

      await cart.save();

      return res.status(200).send({
        status: 200,
        message: "Product added to cart successfully",
      });
    } else {
      return res.status(500).send({
        status: 500,
        message: "OUT OF STOCK",
        data: "Available Stock: " + product.stock,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;