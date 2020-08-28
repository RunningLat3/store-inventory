const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            trim: true
        }
    },
    {
        collection: 'categories',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
);


module.exports = mongoose.model('Category', categorySchema);
