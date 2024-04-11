const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    username: { type: String},
    Pname: { type: String },
    Amount: { type: Number },
    price: { type: Number },
    total: { type: Number },
});

module.exports = mongoose.model('orders', ordersSchema);
