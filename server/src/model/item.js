const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema(
    {
        name: { type: String, trim: true, required: true },
        image: { type: [String], trim: true },
        serialNumber: { type: String, trim: true, required: true },
        categoryId: { type: Schema.Types.ObjectId, trim: true, required: true },
        description: { type: String, trim: true },
        productionDate: { type: Date, default: null, required: true },
        expiryDate: { type: Date, default: null, required: true },
        price: { type: Schema.Types.Decimal128, trim: true, required: true },
        brandId: { type: Schema.Types.ObjectId, trim: true, required: true }
    },
    {
        collection: 'items',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
);

module.exports = mongoose.model('Item', itemSchema);