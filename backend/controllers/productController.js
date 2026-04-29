import Product from '../models/Product.js';
import User from '../models/User.js';

/**
 * Product Controller
 * Handles all product-related operations
 */

/**
 * POST /api/products
 * Create a new product (only vendors can do this)
 *
 * HOW VENDOR ADDS PRODUCT:
 * 1. Vendor sends POST request with product details
 * 2. Controller validates that vendorId exists and is a vendor
 * 3. Creates product with vendor reference
 * 4. Returns created product with success status
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const vendorId = req.user._id; // From auth middleware

    // ===== VALIDATION =====
    // Check if required fields are provided
    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and price',
      });
    }

    // Validate price is a positive number
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number',
      });
    }

    // ===== VERIFY VENDOR EXISTS (already done by middleware) =====
    // req.user is vendor/admin from protect middleware

    // ===== CREATE PRODUCT =====
    const newProduct = new Product({
      name: name.trim(),
      price,
      description: description ? description.trim() : '',
      vendorId, // Auto-set from authenticated user
    });

    // Save product to database
    await newProduct.save();

    // ===== POPULATE VENDOR DETAILS =====
    await newProduct.populate('vendorId', 'name email');

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: newProduct._id,
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        vendorId: newProduct.vendorId,
        createdAt: newProduct.createdAt,
      },
    });
  } catch (error) {
    console.error('Create product error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');
      return res.status(400).json({
        success: false,
        message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
};

/**
 * GET /api/products
 * Retrieve all products (for users to view)
 *
 * HOW USER FETCHES PRODUCTS:
 * 1. User sends GET request to /api/products
 * 2. Controller retrieves all products from database
 * 3. Populates vendor details for each product
 * 4. Returns array of all products with vendor information
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllProducts = async (req, res) => {
  try {
    // ===== FETCH ALL PRODUCTS =====
    // Query all products and populate vendor details
    const products = await Product.find()
      .populate('vendorId', 'name email role') // Include vendor name, email, role
      .sort({ createdAt: -1 }); // Sort by newest first

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      count: products.length,
      products: products.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        vendor: {
          id: product.vendorId._id,
          name: product.vendorId.name,
          email: product.vendorId.email,
        },
        createdAt: product.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get all products error:', error);

    res.status(500).json({
      success: false,
      message: 'Error retrieving products',
      error: error.message,
    });
  }
};

/**
 * GET /api/products/vendor/:vendorId
 * Retrieve all products added by a specific vendor
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProductsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    // ===== VALIDATION =====
    // Check if vendorId is provided
    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a vendor ID',
      });
    }

    // ===== VERIFY VENDOR EXISTS =====
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    // ===== FETCH VENDOR PRODUCTS =====
    // Query products filtered by vendorId
    const products = await Product.find({ vendorId })
      .populate('vendorId', 'name email role')
      .sort({ createdAt: -1 }); // Sort by newest first

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: `Products from vendor ${vendor.name} retrieved successfully`,
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
      },
      count: products.length,
      products: products.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        createdAt: product.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get vendor products error:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error retrieving vendor products',
      error: error.message,
    });
  }
};

/**
 * GET /api/products/:productId
 * Retrieve a single product by ID (optional but useful)
 */
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    // ===== FETCH PRODUCT =====
    const product = await Product.findById(productId).populate(
      'vendorId',
      'name email role'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        vendor: {
          id: product.vendorId._id,
          name: product.vendorId.name,
          email: product.vendorId.email,
        },
        createdAt: product.createdAt,
      },
    });
  } catch (error) {
    console.error('Get product error:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error retrieving product',
      error: error.message,
    });
  }
};

export { createProduct, getAllProducts, getProductsByVendor, getProductById };
