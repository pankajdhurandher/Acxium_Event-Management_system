/**
 * Index Controller
 * Contains handlers for test and basic routes
 * Add your business logic here for different endpoints
 */

/**
 * GET /
 * Test route to verify API is running
 */
const getHome = (req, res) => {
  res.status(200).json({
    message: 'API Running',
    timestamp: new Date().toISOString(),
  });
};

/**
 * GET /health
 * Health check endpoint
 */
const getHealth = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
  });
};

export { getHome, getHealth };
