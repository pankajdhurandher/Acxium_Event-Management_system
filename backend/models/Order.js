import mongoose from 'mongoose';

/**
 * Order Schema
 * Represents customer orders in the system
 */
const orderSchema = new mongoose.Schema(
  {
    // Reference to the user who placed the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model
      required: [true, 'Please provide a user ID'],
    },

    // Array of items in the order
    items: {
      type: [
        {
          // Reference to the product
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          // Product name at time of order (stored for historical reference)
          name: {
            type: String,
            required: true,
          },
          // Product price at time of order
          price: {
            type: Number,
            required: true,
          },
          // Quantity ordered
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      validate: [
        (items) => items && items.length > 0,
        'Order must contain at least one item',
      ],
    },

    // Total amount for the order
    totalAmount: {
      type: Number,
      required: [true, 'Please provide total amount'],
      min: [0, 'Total amount must be greater than 0'],
    },

    // Order status
    status: {
      type: String,
      enum: {
        values: ['placed', 'processing', 'completed', 'cancelled'],
        message: 'Status must be one of: placed, processing, completed, cancelled',
      },
      default: 'placed',
    },

    // Timestamp when order was created
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Timestamp when order was last updated
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
 * Indexes for faster queries
 */
orderSchema.index({ userId: 1 }); // Fast lookup of user's orders
orderSchema.index({ status: 1 }); // Fast lookup by status
orderSchema.index({ createdAt: -1 }); // Fast sorting by date

/**
 * Create and export Order model
 */
const Order = mongoose.model('Order', orderSchema);

export default Order;
