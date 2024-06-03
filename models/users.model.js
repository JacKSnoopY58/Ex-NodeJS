const mongoose = require('mongoose');

const Role = Object.freeze({
    ADMIN: 'admin',
    EMPLOYEE: 'employee'
});

const usersSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    fullname: { type: String},
    address: { type: String},
    email: { type: String },
    dateBirth: {type: Date},
    Image: { type: String},
    role: { type: String, enum: Object.values(Role) },
    isActive: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('users', usersSchema);
