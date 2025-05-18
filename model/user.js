const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullname: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false}
}, { collection: 'users'}
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model