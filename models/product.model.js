const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    Pname: { type: String, unique: true },
    stock: { type: Number },
    price: { type: Number },
    Image: { type: String }
});

module.exports = mongoose.model('products', productsSchema);
