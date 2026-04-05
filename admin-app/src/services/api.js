import axios from 'axios';

const BASE = 'http://localhost:5000/api';

const h = () => {
  const token = sessionStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminAuthAPI = {
  signup: (d) => axios.post(`${BASE}/auth/admin/signup`, d),
  login:  (d) => axios.post(`${BASE}/auth/admin/login`,  d),
};

export const adminAPI = {
  // READ
  overview:         ()    => axios.get(`${BASE}/admin/overview`,             { headers: h() }),
  users:            ()    => axios.get(`${BASE}/admin/users`,                { headers: h() }),
  userEvents:       (uid) => axios.get(`${BASE}/admin/user-events/${uid}`,   { headers: h() }),
  products:         ()    => axios.get(`${BASE}/admin/products`,             { headers: h() }),
  purchaseTracker:  ()    => axios.get(`${BASE}/admin/purchase-tracker`,     { headers: h() }),
  recentEvents:     ()    => axios.get(`${BASE}/admin/recent-events`,        { headers: h() }),
  salesBoard:       ()    => axios.get(`${BASE}/admin/sales-board`,          { headers: h() }),
  cancelledOrders:  ()    => axios.get(`${BASE}/admin/cancelled-orders`,     { headers: h() }),

  // DELETE events
  deleteEvent:           (id)         => axios.delete(`${BASE}/admin/events/${id}`,                   { headers: h() }),
  deleteAllEvents:       ()           => axios.delete(`${BASE}/admin/events/all`,                     { headers: h() }),
  deleteEventsByType:    (actionType) => axios.delete(`${BASE}/admin/events/by-type/${actionType}`,   { headers: h() }),
  deleteEventsByUser:    (userId)     => axios.delete(`${BASE}/admin/events/by-user/${userId}`,       { headers: h() }),
  deleteEventsByProduct: (productId)  => axios.delete(`${BASE}/admin/events/by-product/${productId}`, { headers: h() }),

  // DELETE product stat (resets counts to 0 in user-app too)
  deleteProductStat:     (productId)  => axios.delete(`${BASE}/admin/product-stat/${productId}`,      { headers: h() }),
};
