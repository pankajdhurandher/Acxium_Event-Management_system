import mongoose from 'mongoose';

/**
 * Request Schema
 * Represents user requests for items in the system
 */
const requestSchema = new mongoose.Schema(
  {
    // Reference to the user who made the request
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model
      required: [true, 'Please provide a user ID'],
    },

    // Name of the requested item
    itemName: {
      type: String,
      required: [true, 'Please provide an item name'],
      trim: true,
      maxlength: 100,
    },

    // Detailed description of what is being requested
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Status of the request
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Status must be one of: pending, approved, rejected',
      },
      default: 'pending',
    },

    // Optional: Admin/Vendor comments on the request
    comments: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    // Timestamp when request was created
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Timestamp when request was last updated
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
requestSchema.index({ userId: 1 }); // Fast lookup of user's requests
requestSchema.index({ status: 1 }); // Fast lookup by status
requestSchema.index({ createdAt: -1 }); // Fast sorting by date

/**
 * Create and export Request model
 */
const Request = mongoose.model('Request', requestSchema);

export default Request;
