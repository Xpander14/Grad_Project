const mongoose = require("mongoose");

// The Booking model has been moved to model/booking.js

const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    mobile: String,
    services: [String],
    date: String,
    time: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { collection: 'bookings' }
)

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking