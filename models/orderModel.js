const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        products: {
            type: [Object],
            required: false
        },
        totalAmount: {
            type: Number,
            required: [true, "Please enter total amount."]
        },
        purchasedOn: {
            type: Date,
            required: false,
            default: () => Date.now()
        }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;