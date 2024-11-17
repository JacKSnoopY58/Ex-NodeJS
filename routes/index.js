var express = require('express');
var router = express.Router();
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

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', upload.single('image'), function(req, res, next) {
    let nameImage;
    if(req.file){
      nameImage = req.file.filename; 
      res.send('File uploaded successfully');
    } else {
      res.status(400).send('No file uploaded');
    }
});

router.get("/api/v1/product", async function (req, res, next) {
  try {
    const { page = 1, limit = 10, search = '',sort = 'min', type = '' } = req.query;
    const searchQuery = null;
    if(search){
      searchQuery = {
        name: { $regex: search, $options: 'i'}
      };
    }
  
    const sortOrder = sort === 'min' ? 1 : -1;
    const product = await productSchema
    .find({ name: searchQuery })
    .sort({ price: sortOrder })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    res.status(200).send({
      status: 200,
      message: "Success",
      data: product,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalItems: count,
      role: req.role
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
