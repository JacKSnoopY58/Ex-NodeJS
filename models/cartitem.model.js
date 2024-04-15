const mongoose = require('mongoose');

const cartitemSchema = new mongoose.Schema({

    OrderId: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    Amount: { type: Number },
    price: { type: Number },
    Pname: { type: String},
    Ptotal: { type: Number },
    Pimg: { type: String}
});

module.exports = mongoose.model('cartitems', cartitemSchema);
