const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a name."]
        },
        description: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: [true, "Please enter a price"]
        },
        isActive: {
            type: Boolean,
            required: false,
            default: true
        },
        createdOn: {
            type: Date,
            required: false,
            default: () => Date.now()
        },
        isDeleted: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    {
        timestamps: true
    }
)

//replace find commands for Product for the soft-deleting to work
productSchema.pre('find', function() {
    this.where({ isDeleted: false });
});

productSchema.pre('findOne', function() {
    this.where({ isDeleted: false });
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;