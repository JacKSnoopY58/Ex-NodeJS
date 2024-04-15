const mongoose = require('mongoose');
const Status = Object.freeze({
    Paid: 'paid',
    Notpaid: 'notpaid'
});
const ordersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    total: { type: Number },
    status: { type: String, enum: Object.values(Status), default: Object.values(Status.Notpaid)},
});

module.exports = mongoose.model('orders', ordersSchema);
