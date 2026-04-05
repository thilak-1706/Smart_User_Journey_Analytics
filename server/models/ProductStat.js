const mongoose = require('mongoose');

const productStatSchema = new mongoose.Schema({
  productId:      { type: String, required: true, unique: true },
  productName:    { type: String, required: true },
  category:       { type: String, required: true },
  price:          { type: Number, default: 0 },
  emoji:          { type: String, default: '📦' },
  brand:          { type: String, default: '' },
  totalViews:     { type: Number, default: 0 },
  totalAddToCart: { type: Number, default: 0 },
  totalPurchases: { type: Number, default: 0 },
  totalRevenue:   { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 },
  status:         { type: String, enum: ['hot','normal','slow','dead'], default: 'dead' },
  lastPurchasedAt:{ type: Date, default: null },
  lastViewedAt:   { type: Date, default: null },
}, { timestamps: true });

productStatSchema.methods.recalculate = function () {
  this.conversionRate = this.totalViews > 0
    ? parseFloat(((this.totalPurchases / this.totalViews) * 100).toFixed(1)) : 0;
  if      (this.totalPurchases >= 5) this.status = 'hot';
  else if (this.totalPurchases >= 2) this.status = 'normal';
  else if (this.totalPurchases >= 1) this.status = 'slow';
  else                               this.status = 'dead';
};

module.exports = mongoose.model('ProductStat', productStatSchema);
