const mongoose = require('mongoose');


const Status = Object.freeze({
    Paid: 'paid',
    Notpaid: 'notpaid'
});

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    status: { type: String, enum: Object.values(Status), default: Object.values(Status.Notpaid)},
    total: { type: Number },
});

module.exports = mongoose.model('carts', cartSchema);
