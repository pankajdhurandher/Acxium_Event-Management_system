/**
 * Product Service
 * Handles all product-related API calls
 * 
 * This service provides functions for:
 * - Vendor: Adding new products to their inventory
 * - User: Fetching and viewing products
 */

// API Base URL - Update this to match your backend server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Add a new product (Vendor function)
 * 
 * Called by vendors to add products to their inventory
 * 
 * @param {Object} productData - Product information
 * @param {string} productData.name - Product name
 * @param {number} productData.price - Product price
 * @param {string} productData.description - Product description
 * @param {string} vendorId - Vendor ID from logged-in user
 * 
 * @returns {Promise<Object>} Response containing created product and message
 * @throws {Error} If adding product fails
 * 
 * @example
 * const response = await productService.addProduct({
 *   name: 'Wedding Catering',
 *   price: 5000,
 *   description: 'Full meal catering service'
 * }, vendorId);
 * // { success: true, product: {...}, message: 'Product added successfully' }
 */
export async function addProduct(productData, vendorId) {
  try {
    // Validate required fields
    if (!productData.name || !productData.price || !productData.description) {
      return {
        success: false,
        error: 'All fields (name, price, description) are required',
      };
    }

    // Validate price is a number
    if (isNaN(productData.price) || productData.price <= 0) {
      return {
        success: false,
        error: 'Price must be a valid positive number',
      };
    }

    // Get token from localStorage for authorization
    const token = localStorage.getItem('token');

    // Make API request to add product
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: productData.name.trim(),
        price: parseFloat(productData.price),
        description: productData.description.trim(),
        vendorId: vendorId,
      }),
    });

    // Parse response
    const data = await response.json();

    // Handle error response
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add product. Please try again.');
    }

    // Return success response
    return {
      success: true,
      product: data.product || data,
      message: data.message || 'Product added successfully!',
    };
  } catch (error) {
    console.error('Add product error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while adding the product',
    };
  }
}

/**
 * Get all products (User function)
 * 
 * Called by users to fetch all available products from vendors
 * Used to browse and view products for purchase
 * 
 * @returns {Promise<Object>} Response containing array of products
 * @throws {Error} If fetching products fails
 * 
 * @example
 * const response = await productService.getAllProducts();
 * // { success: true, products: [{name, price, description, vendorId}, ...], message: '...' }
 */
export async function getAllProducts() {
  try {
    // Get token from localStorage for authorization
    const token = localStorage.getItem('token');

    // Make API request to fetch all products
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // Parse response
    const data = await response.json();

    // Handle error response
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products. Please try again.');
    }

    // Return success response
    return {
      success: true,
      products: data.products || data.data || [],
      message: data.message || 'Products fetched successfully!',
    };
  } catch (error) {
    console.error('Fetch products error:', error);
    return {
      success: false,
      products: [],
      error: error.message || 'An error occurred while fetching products',
    };
  }
}

/**
 * Get products by vendor ID (Optional - for future use)
 * 
 * @param {string} vendorId - The vendor ID to fetch products for
 * @returns {Promise<Object>} Response containing vendor's products
 * 
 * @example
 * const response = await productService.getVendorProducts(vendorId);
 */
export async function getVendorProducts(vendorId) {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/products?vendorId=${vendorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch vendor products.');
    }

    return {
      success: true,
      products: data.products || [],
      message: data.message || 'Vendor products fetched successfully!',
    };
  } catch (error) {
    console.error('Fetch vendor products error:', error);
    return {
      success: false,
      products: [],
      error: error.message || 'An error occurred while fetching vendor products',
    };
  }
}
