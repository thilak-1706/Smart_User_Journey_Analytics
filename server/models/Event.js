const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  sessionId:   { type: String, default: 'no-session' },
  userId:      { type: String, required: true },
  userName:    { type: String, default: '' },
  userEmail:   { type: String, default: '' },
  productId:   { type: String, default: null },
  productName: { type: String, default: null },
  category:    { type: String, default: null },
  price:       { type: Number, default: 0 },
  quantity:    { type: Number, default: 1 },
  emoji:       { type: String, default: '' },
  brand:       { type: String, default: '' },
  actionType:  {
    type: String, required: true,
    enum: ['product_viewed','add_to_cart','checkout_product','purchase','page_visit','click_event','order_cancelled'],
  },
  orderId:     { type: String, default: null },
}, { timestamps: true });

eventSchema.index({ userId: 1, actionType: 1 });
eventSchema.index({ productId: 1, actionType: 1 });
eventSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Event', eventSchema);
