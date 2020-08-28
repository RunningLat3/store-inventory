const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        logo: {
            type: String,
            trim: true,
            lowercase: true
        }
    },
    {
        collection: 'brands',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
);


module.exports = mongoose.model('Brand', brandSchema);
