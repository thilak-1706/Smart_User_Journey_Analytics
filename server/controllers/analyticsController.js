const tokenStore = require('../store/tokenStore');

const isDBConnected = () => {
  try { return require('mongoose').connection.readyState === 1; } catch { return false; }
};

let Event, ProductStat, User;
try {
  Event       = require('../models/Event');
  ProductStat = require('../models/ProductStat');
  User        = require('../models/User');
} catch {}

// ── In-memory stores ──────────────────────────────────────────────────────────
const memEvents = [];
const memStats  = {};

const getOrCreateStat = (p) => {
  if (!memStats[p.productId]) {
    memStats[p.productId] = {
      productId: p.productId, productName: p.productName, category: p.category,
      price: p.price || 0, emoji: p.emoji || '📦', brand: p.brand || '',
      totalViews: 0, totalAddToCart: 0, totalPurchases: 0, totalRevenue: 0,
      conversionRate: 0, status: 'dead', lastViewedAt: null, lastPurchasedAt: null,
    };
  }
  return memStats[p.productId];
};

const recalc = (s) => {
  s.conversionRate = s.totalViews > 0 ? parseFloat(((s.totalPurchases / s.totalViews) * 100).toFixed(1)) : 0;
  s.status = s.totalPurchases >= 5 ? 'hot' : s.totalPurchases >= 2 ? 'normal' : s.totalPurchases >= 1 ? 'slow' : 'dead';
};

const updateProductStat = async (ev) => {
  if (!ev.productId) return;
  const inc = {}, set = { productName: ev.productName, category: ev.category, price: ev.price || 0, emoji: ev.emoji || '📦', brand: ev.brand || '' };
  const now = new Date();
  if (ev.actionType === 'product_viewed') { inc.totalViews = 1; set.lastViewedAt = now; }
  if (ev.actionType === 'add_to_cart')    { inc.totalAddToCart = 1; }
  if (ev.actionType === 'purchase')       { inc.totalPurchases = ev.quantity || 1; inc.totalRevenue = (ev.price || 0) * (ev.quantity || 1); set.lastPurchasedAt = now; }
  const stat = await ProductStat.findOneAndUpdate({ productId: ev.productId }, { $inc: inc, $set: set }, { upsert: true, new: true });
  stat.recalculate();
  await stat.save();
};

// ── Full 50-product catalog (source of truth for Sales Board) ─────────────────
const FULL_CATALOG = [
  {id:'p1',  name:'iPhone 15 Pro Max',          category:'Phones',      price:159999, emoji:'📱'},
  {id:'p2',  name:'Samsung Galaxy S24 Ultra',   category:'Phones',      price:134999, emoji:'📱'},
  {id:'p3',  name:'OnePlus 12',                 category:'Phones',      price:64999,  emoji:'📱'},
  {id:'p4',  name:'Google Pixel 8 Pro',         category:'Phones',      price:89999,  emoji:'📱'},
  {id:'p5',  name:'Xiaomi 14 Pro',              category:'Phones',      price:74999,  emoji:'📱'},
  {id:'p6',  name:'Realme GT 5 Pro',            category:'Phones',      price:39999,  emoji:'📱'},
  {id:'p7',  name:'Vivo X100 Pro',              category:'Phones',      price:84999,  emoji:'📱'},
  {id:'p8',  name:'OPPO Find X7 Ultra',         category:'Phones',      price:94999,  emoji:'📱'},
  {id:'l1',  name:'MacBook Pro 16 M3 Max',      category:'Laptops',     price:349999, emoji:'💻'},
  {id:'l2',  name:'Dell XPS 15',                category:'Laptops',     price:169999, emoji:'💻'},
  {id:'l3',  name:'HP Spectre x360',            category:'Laptops',     price:149999, emoji:'💻'},
  {id:'l4',  name:'Lenovo ThinkPad X1 Carbon',  category:'Laptops',     price:139999, emoji:'💻'},
  {id:'l5',  name:'ASUS ROG Zephyrus G16',      category:'Laptops',     price:189999, emoji:'💻'},
  {id:'l6',  name:'Microsoft Surface Laptop 5', category:'Laptops',     price:119999, emoji:'💻'},
  {id:'l7',  name:'Razer Blade 16',             category:'Laptops',     price:279999, emoji:'💻'},
  {id:'l8',  name:'Acer Swift Edge 16',         category:'Laptops',     price:89999,  emoji:'💻'},
  {id:'l9',  name:'MacBook Air M3',             category:'Laptops',     price:119999, emoji:'💻'},
  {id:'l10', name:'LG Gram 17',                 category:'Laptops',     price:109999, emoji:'💻'},
  {id:'g1',  name:'Apple Watch Ultra 2',        category:'Gadgets',     price:89900,  emoji:'⌚'},
  {id:'g2',  name:'Samsung Galaxy Watch 6',     category:'Gadgets',     price:34999,  emoji:'⌚'},
  {id:'g3',  name:'Garmin Fenix 7X Pro',        category:'Gadgets',     price:79999,  emoji:'⌚'},
  {id:'g4',  name:'Sony WH-1000XM5',            category:'Gadgets',     price:29990,  emoji:'🎧'},
  {id:'g5',  name:'AirPods Pro 2nd Gen',        category:'Gadgets',     price:24900,  emoji:'🎧'},
  {id:'g6',  name:'Bose QuietComfort 45',       category:'Gadgets',     price:26990,  emoji:'🎧'},
  {id:'g7',  name:'DJI Mini 4 Pro',             category:'Gadgets',     price:74999,  emoji:'🚁'},
  {id:'g8',  name:'GoPro Hero 12 Black',        category:'Gadgets',     price:43500,  emoji:'📷'},
  {id:'g9',  name:'Meta Quest 3',               category:'Gadgets',     price:49999,  emoji:'🥽'},
  {id:'g10', name:'Fitbit Charge 6',            category:'Gadgets',     price:14999,  emoji:'⌚'},
  {id:'g11', name:'Nothing Phone 2a',           category:'Gadgets',     price:23999,  emoji:'📱'},
  {id:'g12', name:'Amazon Echo Show 10',        category:'Gadgets',     price:24999,  emoji:'🔊'},
  {id:'t1',  name:'iPad Pro 12.9 M2',           category:'Gadgets',     price:112900, emoji:'📟'},
  {id:'t2',  name:'Samsung Galaxy Tab S9 Ultra',category:'Gadgets',     price:108999, emoji:'📟'},
  {id:'t3',  name:'Microsoft Surface Pro 9',    category:'Gadgets',     price:119999, emoji:'📟'},
  {id:'t4',  name:'OnePlus Pad 2',              category:'Gadgets',     price:39999,  emoji:'📟'},
  {id:'c1',  name:'Sony Alpha A7 IV',           category:'Gadgets',     price:219999, emoji:'📷'},
  {id:'c2',  name:'Canon EOS R5',               category:'Gadgets',     price:349999, emoji:'📷'},
  {id:'c3',  name:'Nikon Z8',                   category:'Gadgets',     price:289999, emoji:'📷'},
  {id:'gm1', name:'PlayStation 5 Slim',         category:'Gadgets',     price:54990,  emoji:'🎮'},
  {id:'gm2', name:'Xbox Series X',              category:'Gadgets',     price:51990,  emoji:'🎮'},
  {id:'gm3', name:'Nintendo Switch OLED',       category:'Gadgets',     price:29999,  emoji:'🎮'},
  {id:'gm4', name:'ASUS ROG Ally',              category:'Gadgets',     price:79999,  emoji:'🎮'},
  {id:'a1',  name:'Apple Magic Keyboard',       category:'Accessories', price:12900,  emoji:'⌨️'},
  {id:'a2',  name:'Logitech MX Master 3S',      category:'Accessories', price:9999,   emoji:'🖱️'},
  {id:'a3',  name:'Anker 100W GaN Charger',     category:'Accessories', price:3999,   emoji:'🔌'},
  {id:'a4',  name:'Samsung 25000mAh Power Bank',category:'Accessories', price:4999,   emoji:'🔋'},
  {id:'a5',  name:'SanDisk 1TB Portable SSD',   category:'Accessories', price:12999,  emoji:'💾'},
  {id:'a6',  name:'LG 34 UltraWide Monitor',    category:'Accessories', price:54999,  emoji:'🖥️'},
  {id:'a7',  name:'Elgato Stream Deck MK.2',    category:'Accessories', price:14999,  emoji:'🎛️'},
  {id:'a8',  name:'UGREEN USB-C Hub 10-in-1',   category:'Accessories', price:3499,   emoji:'🔌'},
  {id:'a9',  name:'Keychron K2 Pro Keyboard',   category:'Accessories', price:8999,   emoji:'⌨️'},
  {id:'a10', name:'Apple AirTag 4 Pack',        category:'Accessories', price:11900,  emoji:'🏷️'},
];

// ── POST /api/track ───────────────────────────────────────────────────────────
const trackEvent = async (req, res) => {
  try {
    const { sessionId, productId, productName, actionType, category, price, quantity, emoji, brand } = req.body;
    if (!actionType) return res.status(400).json({ message: 'actionType required' });
    const ev = {
      sessionId: sessionId || 'no-session',
      userId: req.user._id?.toString() || req.user.id,
      userName: req.user.name, userEmail: req.user.email,
      productId, productName, category,
      price: price || 0, quantity: quantity || 1,
      emoji, brand, actionType, createdAt: new Date(),
    };
    if (isDBConnected()) {
      await new Event(ev).save();
      if (productId && ['product_viewed','add_to_cart','purchase'].includes(actionType)) await updateProductStat(ev);
    } else {
      memEvents.push(ev);
      if (productId && ['product_viewed','add_to_cart','purchase'].includes(actionType)) {
        const s = getOrCreateStat(ev);
        if (actionType === 'product_viewed') { s.totalViews++; s.lastViewedAt = new Date(); }
        if (actionType === 'add_to_cart')    { s.totalAddToCart++; }
        if (actionType === 'purchase')       { s.totalPurchases += (quantity||1); s.totalRevenue += (price||0)*(quantity||1); s.lastPurchasedAt = new Date(); }
        recalc(s);
      }
    }
    res.status(201).json({ success: true });
  } catch (err) { console.error('trackEvent:', err.message); res.status(500).json({ message: err.message }); }
};

// ── GET /api/analytics/my-summary ────────────────────────────────────────────
const getMySummary = async (req, res) => {
  try {
    const uid = req.user._id?.toString() || req.user.id;
    if (isDBConnected()) {
      const [views, cart, purchases] = await Promise.all([
        Event.countDocuments({ userId: uid, actionType: 'product_viewed' }),
        Event.countDocuments({ userId: uid, actionType: 'add_to_cart' }),
        Event.countDocuments({ userId: uid, actionType: 'purchase' }),
      ]);
      return res.json({ productViews: views, addToCart: cart, purchases, totalEvents: views+cart+purchases });
    }
    const ue = memEvents.filter(e => e.userId === uid);
    res.json({ productViews: ue.filter(e=>e.actionType==='product_viewed').length, addToCart: ue.filter(e=>e.actionType==='add_to_cart').length, purchases: ue.filter(e=>e.actionType==='purchase').length, totalEvents: ue.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── GET /api/analytics/my-events ─────────────────────────────────────────────
const getMyEvents = async (req, res) => {
  try {
    const uid = req.user._id?.toString() || req.user.id;
    if (isDBConnected()) return res.json(await Event.find({ userId: uid }).sort({ createdAt: -1 }).limit(100));
    res.json(memEvents.filter(e=>e.userId===uid).slice(-100).reverse());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── ADMIN: GET /api/admin/overview ────────────────────────────────────────────
const getAdminOverview = async (req, res) => {
  try {
    if (isDBConnected()) {
      const [totalUsers, totalEvents, totalPurchases, revenueAgg] = await Promise.all([
        User.countDocuments({ role:'user' }), Event.countDocuments(),
        Event.countDocuments({ actionType:'purchase' }),
        ProductStat.aggregate([{ $group:{ _id:null, rev:{ $sum:'$totalRevenue' } } }]),
      ]);
      const topProduct = await ProductStat.findOne().sort({ totalPurchases:-1 });
      return res.json({ totalUsers, totalEvents, totalPurchases, totalRevenue: revenueAgg[0]?.rev||0, topProduct });
    }
    const allStats = Object.values(memStats);
    res.json({
      totalUsers: tokenStore.users.filter(u=>u.role==='user').length,
      totalEvents: memEvents.length,
      totalPurchases: memEvents.filter(e=>e.actionType==='purchase').length,
      totalRevenue: allStats.reduce((s,p)=>s+p.totalRevenue,0),
      topProduct: allStats.sort((a,b)=>b.totalPurchases-a.totalPurchases)[0]||null,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── ADMIN: GET /api/admin/users ───────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    if (isDBConnected()) {
      const users = await User.find({ role:'user' }).select('-password -token').sort({ createdAt:-1 });
      const withStats = await Promise.all(users.map(async u => {
        const uid = u._id.toString();
        const [views, cart, purchases, evArr] = await Promise.all([
          Event.countDocuments({ userId:uid, actionType:'product_viewed' }),
          Event.countDocuments({ userId:uid, actionType:'add_to_cart' }),
          Event.countDocuments({ userId:uid, actionType:'purchase' }),
          Event.find({ userId:uid, actionType:'purchase' }),
        ]);
        const revenue = evArr.reduce((s,e)=>s+(e.price||0)*(e.quantity||1),0);
        return { ...u.toObject(), stats:{ views, cart, purchases, revenue } };
      }));
      return res.json(withStats);
    }
    const users = tokenStore.users.filter(u=>u.role==='user');
    res.json(users.map(u => {
      const ue = memEvents.filter(e=>e.userId===u.id);
      const pe = ue.filter(e=>e.actionType==='purchase');
      return { _id:u.id, name:u.name, email:u.email, role:u.role, createdAt: new Date().toISOString(),
        stats:{ views:ue.filter(e=>e.actionType==='product_viewed').length, cart:ue.filter(e=>e.actionType==='add_to_cart').length, purchases:pe.length, revenue:pe.reduce((s,e)=>s+(e.price||0)*(e.quantity||1),0) } };
    }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── ADMIN: GET /api/admin/user-events/:uid ────────────────────────────────────
const getUserEvents = async (req, res) => {
  try {
    const uid = req.params.uid;
    if (isDBConnected()) return res.json(await Event.find({ userId:uid }).sort({ createdAt:-1 }).limit(200));
    res.json(memEvents.filter(e=>e.userId===uid).slice(-200).reverse());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── ADMIN: GET /api/admin/products ────────────────────────────────────────────
const getProductStats = async (req, res) => {
  try {
    if (isDBConnected()) return res.json(await ProductStat.find({}).sort({ totalPurchases:-1 }));
    res.json(Object.values(memStats).sort((a,b)=>b.totalPurchases-a.totalPurchases));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── ADMIN: GET /api/admin/purchase-tracker ────────────────────────────────────
const getPurchaseTracker = async (req, res) => {
  try {
    if (isDBConnected()) {
      const all = await ProductStat.find({}).sort({ totalPurchases:1, totalViews:-1 });
      const agg = await ProductStat.aggregate([{ $group:{ _id:null, rev:{$sum:'$totalRevenue'}, purchases:{$sum:'$totalPurchases'}, views:{$sum:'$totalViews'} } }]);
      return res.json({ products:all, totals:agg[0]||{rev:0,purchases:0,views:0},
        statusCounts:{ hot:all.filter(p=>p.status==='hot').length, normal:all.filter(p=>p.status==='normal').length, slow:all.filter(p=>p.status==='slow').length, dead:all.filter(p=>p.status==='dead').length } });
    }
    const all = Object.values(memStats);
    res.json({ products:all, totals:{rev:all.reduce((s,p)=>s+p.totalRevenue,0), purchases:all.reduce((s,p)=>s+p.totalPurchases,0), views:all.reduce((s,p)=>s+p.totalViews,0)},
      statusCounts:{hot:all.filter(p=>p.status==='hot').length,normal:all.filter(p=>p.status==='normal').length,slow:all.filter(p=>p.status==='slow').length,dead:all.filter(p=>p.status==='dead').length} });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── ADMIN: GET /api/admin/recent-events ──────────────────────────────────────
const getRecentEvents = async (req, res) => {
  try {
    if (isDBConnected()) return res.json(await Event.find().sort({ createdAt:-1 }).limit(100));
    res.json([...memEvents].reverse().slice(0,100));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── ADMIN: GET /api/admin/sales-board ────────────────────────────────────────
const getSalesBoard = async (req, res) => {
  try {
    const statsMap = {};
    if (isDBConnected()) {
      const dbStats = await ProductStat.find({});
      dbStats.forEach(s => { statsMap[s.productId] = s; });
    } else {
      Object.values(memStats).forEach(s => { statsMap[s.productId] = s; });
    }

    const board = FULL_CATALOG.map(p => {
      const s = statsMap[p.id] || {};
      return {
        productId:      p.id,
        productName:    p.name,
        category:       p.category,
        price:          p.price,
        emoji:          p.emoji,
        unitsSold:      s.totalPurchases    || 0,
        totalRevenue:   s.totalRevenue      || 0,
        totalViews:     s.totalViews        || 0,
        totalAddToCart: s.totalAddToCart    || 0,
        status:         s.status            || 'not started',
      };
    });

    // Sort by units sold desc, then name asc
    board.sort((a,b) => b.unitsSold - a.unitsSold || a.productName.localeCompare(b.productName));
    board.forEach((p,i) => { p.rank = i+1; });

    const totalRevenue = board.reduce((s,p)=>s+p.totalRevenue, 0);
    const totalSold    = board.reduce((s,p)=>s+p.unitsSold,    0);

    res.json({ board, summary:{ totalProducts: board.length, totalRevenue, totalSold } });
  } catch (err) {
    console.error('getSalesBoard error:', err.message);
    res.status(500).json({ message: 'Sales board failed: ' + err.message });
  }
};

// ── EXPORTS — ALL functions defined above, exported once ─────────────────────
module.exports = {
  trackEvent,
  getMySummary,
  getMyEvents,
  getAdminOverview,
  getAllUsers,
  getUserEvents,
  getProductStats,
  getPurchaseTracker,
  getRecentEvents,
  getSalesBoard,       // ← now properly included
};

// ── DELETE: single event by _id ───────────────────────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDBConnected()) {
      await Event.findByIdAndDelete(id);
      return res.json({ success: true });
    }
    const idx = memEvents.findIndex(e => e._id === id || e.tempId === id);
    if (idx !== -1) memEvents.splice(idx, 1);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── DELETE: all events by actionType ─────────────────────────────────────────
const deleteEventsByType = async (req, res) => {
  try {
    const { actionType } = req.params;
    if (isDBConnected()) {
      const result = await Event.deleteMany({ actionType });
      // Recalculate affected ProductStats
      if (actionType === 'purchase') {
        await ProductStat.updateMany({}, { $set: { totalPurchases: 0, totalRevenue: 0, status: 'dead', conversionRate: 0 } });
      }
      if (actionType === 'add_to_cart') {
        await ProductStat.updateMany({}, { $set: { totalAddToCart: 0 } });
      }
      if (actionType === 'product_viewed') {
        await ProductStat.updateMany({}, { $set: { totalViews: 0, conversionRate: 0 } });
      }
      return res.json({ success: true, deleted: result.deletedCount });
    }
    const before = memEvents.length;
    const toRemove = memEvents.filter(e => e.actionType === actionType);
    toRemove.forEach(e => memEvents.splice(memEvents.indexOf(e), 1));
    res.json({ success: true, deleted: before - memEvents.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── DELETE: all events by userId ──────────────────────────────────────────────
const deleteEventsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (isDBConnected()) {
      const result = await Event.deleteMany({ userId });
      // Recalculate all ProductStats from scratch
      await recalcAllProductStats();
      return res.json({ success: true, deleted: result.deletedCount });
    }
    const before = memEvents.length;
    const toRemove = memEvents.filter(e => e.userId === userId);
    toRemove.forEach(e => memEvents.splice(memEvents.indexOf(e), 1));
    res.json({ success: true, deleted: before - memEvents.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── DELETE: all events for a product ─────────────────────────────────────────
const deleteEventsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (isDBConnected()) {
      await Event.deleteMany({ productId });
      await ProductStat.findOneAndUpdate({ productId }, {
        $set: { totalViews:0, totalAddToCart:0, totalPurchases:0, totalRevenue:0, conversionRate:0, status:'dead' }
      });
      return res.json({ success: true });
    }
    const toRemove = memEvents.filter(e => e.productId === productId);
    toRemove.forEach(e => memEvents.splice(memEvents.indexOf(e), 1));
    if (memStats[productId]) {
      memStats[productId] = { ...memStats[productId], totalViews:0, totalAddToCart:0, totalPurchases:0, totalRevenue:0, conversionRate:0, status:'dead' };
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── DELETE: ALL events ────────────────────────────────────────────────────────
const deleteAllEvents = async (req, res) => {
  try {
    if (isDBConnected()) {
      await Event.deleteMany({});
      await ProductStat.updateMany({}, { $set: { totalViews:0, totalAddToCart:0, totalPurchases:0, totalRevenue:0, conversionRate:0, status:'dead' } });
      return res.json({ success: true });
    }
    memEvents.splice(0, memEvents.length);
    Object.keys(memStats).forEach(k => {
      memStats[k] = { ...memStats[k], totalViews:0, totalAddToCart:0, totalPurchases:0, totalRevenue:0, conversionRate:0, status:'dead' };
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── Helper: recalc all ProductStats from remaining events ─────────────────────
const recalcAllProductStats = async () => {
  if (!isDBConnected()) return;
  const allEvents = await Event.find({ actionType: { $in: ['product_viewed','add_to_cart','purchase'] } });
  await ProductStat.updateMany({}, { $set: { totalViews:0, totalAddToCart:0, totalPurchases:0, totalRevenue:0 } });
  for (const ev of allEvents) {
    const inc = {};
    if (ev.actionType === 'product_viewed') inc.totalViews = 1;
    if (ev.actionType === 'add_to_cart')    inc.totalAddToCart = 1;
    if (ev.actionType === 'purchase')       { inc.totalPurchases = ev.quantity||1; inc.totalRevenue = (ev.price||0)*(ev.quantity||1); }
    await ProductStat.findOneAndUpdate({ productId: ev.productId }, { $inc: inc }, { upsert: true });
  }
  const stats = await ProductStat.find({});
  for (const s of stats) { s.recalculate(); await s.save(); }
};

// Re-export with delete functions added
const existingExports = module.exports;
module.exports = {
  ...existingExports,
  deleteEvent,
  deleteEventsByType,
  deleteEventsByUser,
  deleteEventsByProduct,
  deleteAllEvents,
};

// ── GET /api/admin/cancelled-orders ──────────────────────────────────────────
// Reads cancelled orders from all users (stored in localStorage on user side,
// but admin can also see them via a shared in-memory + DB store)
// We track cancellations via a special "order_cancelled" event in the Event collection
const getCancelledOrders = async (req, res) => {
  try {
    if (isDBConnected()) {
      const evs = await Event.find({ actionType: 'order_cancelled' }).sort({ createdAt: -1 });
      return res.json(evs);
    }
    res.json(memEvents.filter(e => e.actionType === 'order_cancelled').slice().reverse());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── DELETE /api/admin/product-stat/:productId — reset a product's stats ──────
const deleteProductStat = async (req, res) => {
  try {
    const { productId } = req.params;
    if (isDBConnected()) {
      await Event.deleteMany({ productId });
      await ProductStat.findOneAndUpdate({ productId }, {
        $set: { totalViews:0, totalAddToCart:0, totalPurchases:0, totalRevenue:0,
                conversionRate:0, status:'dead', lastPurchasedAt:null }
      });
      return res.json({ success: true });
    }
    const toRemove = memEvents.filter(e => e.productId === productId);
    toRemove.forEach(e => memEvents.splice(memEvents.indexOf(e), 1));
    if (memStats[productId]) {
      Object.assign(memStats[productId], { totalViews:0, totalAddToCart:0, totalPurchases:0, totalRevenue:0, conversionRate:0, status:'dead' });
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// append to module.exports
const prev2 = module.exports;
module.exports = { ...prev2, getCancelledOrders, deleteProductStat };
