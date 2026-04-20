import axios from 'axios';

const normalizeApiBase = (value) => {
  const trimmed = (value || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const getApiBase = () => {
  const envBase = normalizeApiBase(process.env.REACT_APP_API_URL);
  if (envBase) return envBase;

  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `${window.location.origin}/api`;
  }

  return 'http://localhost:5000/api';
};

const BASE_URL = getApiBase();

const h = () => {
  const token = sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Get current user ID from sessionStorage for per-user keys ─────────────────
const uid = () => {
  try {
    const u = sessionStorage.getItem('u_user');
    return u ? JSON.parse(u).id || JSON.parse(u)._id || 'guest' : 'guest';
  } catch { return 'guest'; }
};

const cartKey   = () => `u_cart_${uid()}`;
const eventsKey = () => `u_events_${uid()}`;
const ordersKey = () => `u_orders_${uid()}`;

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (d) => axios.post(`${BASE_URL}/auth/user/signup`, d),
  login:  (d) => axios.post(`${BASE_URL}/auth/user/login`,  d),
};

// ── Analytics API ─────────────────────────────────────────────────────────────
export const analyticsAPI = {
  track:    (d) => axios.post(`${BASE_URL}/track`,                   d, { headers: h() }),
  summary:  ()  => axios.get(`${BASE_URL}/analytics/my-summary`,        { headers: h() }),
  myEvents: ()  => axios.get(`${BASE_URL}/analytics/my-events`,          { headers: h() }),
};

// ── Per-user Cart ─────────────────────────────────────────────────────────────
export const localCart = {
  get:   ()  => JSON.parse(localStorage.getItem(cartKey()) || '[]'),
  set:   (c) => localStorage.setItem(cartKey(), JSON.stringify(c)),
  clear: ()  => localStorage.removeItem(cartKey()),
};

// ── Per-user Events ───────────────────────────────────────────────────────────
export const localEvents = {
  get: () => JSON.parse(localStorage.getItem(eventsKey()) || '[]'),
  add: (e) => {
    const ev = localEvents.get();
    ev.push(e);
    localStorage.setItem(eventsKey(), JSON.stringify(ev.slice(-200)));
  },
  clear: () => localStorage.removeItem(eventsKey()),
  summary: () => {
    const ev = localEvents.get();
    return {
      productViews: ev.filter(e => e.actionType === 'product_viewed').length,
      addToCart:    ev.filter(e => e.actionType === 'add_to_cart').length,
      purchases:    ev.filter(e => e.actionType === 'purchase').length,
    };
  },
};

// ── Per-user Orders ───────────────────────────────────────────────────────────
export const localOrders = {
  get: () => JSON.parse(localStorage.getItem(ordersKey()) || '[]'),

  add: (order) => {
    const orders = localOrders.get();
    orders.unshift(order);
    localStorage.setItem(ordersKey(), JSON.stringify(orders));
  },

  cancel: (orderId, user, sessionId) => {
    const orders = localOrders.get().map(o =>
      o.orderId === orderId
        ? { ...o, status: 'cancelled', cancelledAt: new Date().toISOString() }
        : o
    );
    localStorage.setItem(ordersKey(), JSON.stringify(orders));

    // Track cancellation on server so admin Cancelled Orders tab populates
    const cancelled = orders.find(o => o.orderId === orderId);
    if (cancelled && user) {
      cancelled.items.forEach(item => {
        const ev = {
          sessionId: sessionId || 'no-session',
          userId:    user.id || user._id,
          productId: item.id,
          productName: item.name,
          category:  item.category,
          price:     item.price,
          quantity:  item.quantity,
          emoji:     item.emoji,
          brand:     item.brand || '',
          actionType: 'order_cancelled',
          orderId,
        };
        analyticsAPI.track(ev).catch(() => {});
      });
    }
  },

  count: () => localOrders.get().filter(o => o.status === 'active').length,
};
