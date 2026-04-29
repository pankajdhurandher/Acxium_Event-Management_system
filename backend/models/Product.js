import mongoose from 'mongoose';

/**
 * Product Schema
 * Represents products that vendors can create and users can view
 */
const productSchema = new mongoose.Schema(
  {
    // Product name
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: 100,
    },

    // Product price
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price must be greater than 0'],
    },

    // Product description
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Reference to the vendor (User) who created this product
    // This creates a relationship between Product and User models
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model
      required: [true, 'Please provide a vendor ID'],
    },

    // Timestamp when product was created
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Timestamp when product was last updated
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Index for faster queries
 * Creates an index on vendorId for faster lookups
 */
productSchema.index({ vendorId: 1 });

/**
 * Create and export Product model
 */
const Product = mongoose.model('Product', productSchema);

export default Product;
