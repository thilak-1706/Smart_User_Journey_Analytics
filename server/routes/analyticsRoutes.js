const express = require('express');
const router  = express.Router();
const {
  trackEvent, getMySummary, getMyEvents,
  getAdminOverview, getAllUsers, getUserEvents,
  getProductStats, getPurchaseTracker, getRecentEvents, getSalesBoard,
  deleteEvent, deleteEventsByType, deleteEventsByUser, deleteEventsByProduct, deleteAllEvents,
  getCancelledOrders, deleteProductStat,
} = require('../controllers/analyticsController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// ── User routes ───────────────────────────────────────────────────────────────
router.post('/track',                        authMiddleware, trackEvent);
router.get('/analytics/my-summary',         authMiddleware, getMySummary);
router.get('/analytics/my-events',          authMiddleware, getMyEvents);

// ── Admin READ ────────────────────────────────────────────────────────────────
router.get('/admin/overview',               adminOnly, getAdminOverview);
router.get('/admin/users',                  adminOnly, getAllUsers);
router.get('/admin/user-events/:uid',       adminOnly, getUserEvents);
router.get('/admin/products',               adminOnly, getProductStats);
router.get('/admin/purchase-tracker',       adminOnly, getPurchaseTracker);
router.get('/admin/recent-events',          adminOnly, getRecentEvents);
router.get('/admin/sales-board',            adminOnly, getSalesBoard);
router.get('/admin/cancelled-orders',       adminOnly, getCancelledOrders);

// ── Admin DELETE events ───────────────────────────────────────────────────────
router.delete('/admin/events/all',                   adminOnly, deleteAllEvents);
router.delete('/admin/events/by-type/:actionType',   adminOnly, deleteEventsByType);
router.delete('/admin/events/by-user/:userId',       adminOnly, deleteEventsByUser);
router.delete('/admin/events/by-product/:productId', adminOnly, deleteEventsByProduct);
router.delete('/admin/events/:id',                   adminOnly, deleteEvent);

// ── Admin DELETE product stats ────────────────────────────────────────────────
router.delete('/admin/product-stat/:productId',      adminOnly, deleteProductStat);

module.exports = router;
