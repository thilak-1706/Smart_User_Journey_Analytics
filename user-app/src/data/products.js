export const products = [
  // PHONES
  { id: 'p1', name: 'iPhone 15 Pro Max', category: 'Phones', price: 159999, emoji: '📱', brand: 'Apple', rating: 4.8, specs: '256GB | A17 Pro | 48MP' },
  { id: 'p2', name: 'Samsung Galaxy S24 Ultra', category: 'Phones', price: 134999, emoji: '📱', brand: 'Samsung', rating: 4.7, specs: '256GB | Snapdragon 8 Gen 3 | 200MP' },
  { id: 'p3', name: 'OnePlus 12', category: 'Phones', price: 64999, emoji: '📱', brand: 'OnePlus', rating: 4.5, specs: '256GB | Snapdragon 8 Gen 3 | 50MP' },
  { id: 'p4', name: 'Google Pixel 8 Pro', category: 'Phones', price: 89999, emoji: '📱', brand: 'Google', rating: 4.6, specs: '128GB | Tensor G3 | 50MP' },
  { id: 'p5', name: 'Xiaomi 14 Pro', category: 'Phones', price: 74999, emoji: '📱', brand: 'Xiaomi', rating: 4.5, specs: '256GB | Snapdragon 8 Gen 3 | 50MP' },
  { id: 'p6', name: 'Realme GT 5 Pro', category: 'Phones', price: 39999, emoji: '📱', brand: 'Realme', rating: 4.3, specs: '256GB | Snapdragon 8 Gen 2 | 50MP' },
  { id: 'p7', name: 'Vivo X100 Pro', category: 'Phones', price: 84999, emoji: '📱', brand: 'Vivo', rating: 4.4, specs: '256GB | Dimensity 9300 | 50MP' },
  { id: 'p8', name: 'OPPO Find X7 Ultra', category: 'Phones', price: 94999, emoji: '📱', brand: 'OPPO', rating: 4.5, specs: '256GB | Snapdragon 8 Gen 3 | 50MP' },

  // LAPTOPS
  { id: 'l1', name: 'MacBook Pro 16" M3 Max', category: 'Laptops', price: 349999, emoji: '💻', brand: 'Apple', rating: 4.9, specs: '36GB RAM | 1TB SSD | M3 Max' },
  { id: 'l2', name: 'Dell XPS 15', category: 'Laptops', price: 169999, emoji: '💻', brand: 'Dell', rating: 4.6, specs: '32GB RAM | 1TB SSD | RTX 4070' },
  { id: 'l3', name: 'HP Spectre x360', category: 'Laptops', price: 149999, emoji: '💻', brand: 'HP', rating: 4.5, specs: '16GB RAM | 512GB SSD | Intel i7' },
  { id: 'l4', name: 'Lenovo ThinkPad X1 Carbon', category: 'Laptops', price: 139999, emoji: '💻', brand: 'Lenovo', rating: 4.6, specs: '16GB RAM | 512GB SSD | Intel i7' },
  { id: 'l5', name: 'ASUS ROG Zephyrus G16', category: 'Laptops', price: 189999, emoji: '💻', brand: 'ASUS', rating: 4.7, specs: '32GB RAM | 1TB SSD | RTX 4080' },
  { id: 'l6', name: 'Microsoft Surface Laptop 5', category: 'Laptops', price: 119999, emoji: '💻', brand: 'Microsoft', rating: 4.4, specs: '16GB RAM | 512GB SSD | Intel i7' },
  { id: 'l7', name: 'Razer Blade 16', category: 'Laptops', price: 279999, emoji: '💻', brand: 'Razer', rating: 4.6, specs: '32GB RAM | 1TB SSD | RTX 4090' },
  { id: 'l8', name: 'Acer Swift Edge 16', category: 'Laptops', price: 89999, emoji: '💻', brand: 'Acer', rating: 4.3, specs: '16GB RAM | 512GB SSD | Ryzen 7' },
  { id: 'l9', name: 'MacBook Air M3', category: 'Laptops', price: 119999, emoji: '💻', brand: 'Apple', rating: 4.8, specs: '16GB RAM | 512GB SSD | M3' },
  { id: 'l10', name: 'LG Gram 17', category: 'Laptops', price: 109999, emoji: '💻', brand: 'LG', rating: 4.4, specs: '16GB RAM | 512GB SSD | Intel i7' },

  // SMART WATCHES & GADGETS
  { id: 'g1', name: 'Apple Watch Ultra 2', category: 'Gadgets', price: 89900, emoji: '⌚', brand: 'Apple', rating: 4.8, specs: '49mm | Titanium | GPS + Cellular' },
  { id: 'g2', name: 'Samsung Galaxy Watch 6 Classic', category: 'Gadgets', price: 34999, emoji: '⌚', brand: 'Samsung', rating: 4.5, specs: '47mm | Sapphire Glass | Health Monitor' },
  { id: 'g3', name: 'Garmin Fenix 7X Pro', category: 'Gadgets', price: 79999, emoji: '⌚', brand: 'Garmin', rating: 4.7, specs: 'Solar | Multi-sport GPS | 28-day battery' },
  { id: 'g4', name: 'Sony WH-1000XM5', category: 'Gadgets', price: 29990, emoji: '🎧', brand: 'Sony', rating: 4.8, specs: '30hr battery | ANC | LDAC' },
  { id: 'g5', name: 'AirPods Pro 2nd Gen', category: 'Gadgets', price: 24900, emoji: '🎧', brand: 'Apple', rating: 4.7, specs: 'H2 chip | ANC | Adaptive Audio' },
  { id: 'g6', name: 'Bose QuietComfort 45', category: 'Gadgets', price: 26990, emoji: '🎧', brand: 'Bose', rating: 4.6, specs: '24hr battery | ANC | Comfortable' },
  { id: 'g7', name: 'DJI Mini 4 Pro', category: 'Gadgets', price: 74999, emoji: '🚁', brand: 'DJI', rating: 4.7, specs: '4K/60fps | 34-min flight | Obstacle Sensing' },
  { id: 'g8', name: 'GoPro Hero 12 Black', category: 'Gadgets', price: 43500, emoji: '📷', brand: 'GoPro', rating: 4.5, specs: '5.3K | HyperSmooth 6.0 | Waterproof' },
  { id: 'g9', name: 'Meta Quest 3', category: 'Gadgets', price: 49999, emoji: '🥽', brand: 'Meta', rating: 4.5, specs: 'Mixed Reality | Snapdragon XR2 Gen 2 | 128GB' },
  { id: 'g10', name: 'Fitbit Charge 6', category: 'Gadgets', price: 14999, emoji: '⌚', brand: 'Fitbit', rating: 4.3, specs: 'Heart Rate | GPS | Google integration' },
  { id: 'g11', name: 'Nothing Phone 2a', category: 'Gadgets', price: 23999, emoji: '📱', brand: 'Nothing', rating: 4.3, specs: '12GB RAM | 256GB | Glyph Interface' },
  { id: 'g12', name: 'Amazon Echo Show 10', category: 'Gadgets', price: 24999, emoji: '🔊', brand: 'Amazon', rating: 4.4, specs: '10.1" HD | Alexa | 13MP camera' },

  // TABLETS
  { id: 't1', name: 'iPad Pro 12.9" M2', category: 'Gadgets', price: 112900, emoji: '📟', brand: 'Apple', rating: 4.9, specs: '256GB | M2 chip | Mini-LED | 12MP' },
  { id: 't2', name: 'Samsung Galaxy Tab S9 Ultra', category: 'Gadgets', price: 108999, emoji: '📟', brand: 'Samsung', rating: 4.7, specs: '256GB | Snapdragon 8 Gen 2 | 14.6" AMOLED' },
  { id: 't3', name: 'Microsoft Surface Pro 9', category: 'Gadgets', price: 119999, emoji: '📟', brand: 'Microsoft', rating: 4.5, specs: '16GB RAM | 256GB | Intel i7 | Windows 11' },
  { id: 't4', name: 'OnePlus Pad 2', category: 'Gadgets', price: 39999, emoji: '📟', brand: 'OnePlus', rating: 4.4, specs: '256GB | Snapdragon 8 Gen 3 | 12.1" LTPO' },

  // CAMERAS
  { id: 'c1', name: 'Sony Alpha A7 IV', category: 'Gadgets', price: 219999, emoji: '📷', brand: 'Sony', rating: 4.8, specs: '33MP | 4K/60fps | IBIS | Eye-AF' },
  { id: 'c2', name: 'Canon EOS R5', category: 'Gadgets', price: 349999, emoji: '📷', brand: 'Canon', rating: 4.9, specs: '45MP | 8K RAW | IBIS | Dual Pixel AF' },
  { id: 'c3', name: 'Nikon Z8', category: 'Gadgets', price: 289999, emoji: '📷', brand: 'Nikon', rating: 4.7, specs: '45.7MP | 8K/60fps | ProRes | IBIS' },

  // GAMING
  { id: 'gm1', name: 'PlayStation 5 Slim', category: 'Gadgets', price: 54990, emoji: '🎮', brand: 'Sony', rating: 4.8, specs: '1TB SSD | 4K/120fps | DualSense' },
  { id: 'gm2', name: 'Xbox Series X', category: 'Gadgets', price: 51990, emoji: '🎮', brand: 'Microsoft', rating: 4.7, specs: '1TB SSD | 4K/120fps | Game Pass' },
  { id: 'gm3', name: 'Nintendo Switch OLED', category: 'Gadgets', price: 29999, emoji: '🎮', brand: 'Nintendo', rating: 4.6, specs: '7" OLED | 64GB | Handheld/TV mode' },
  { id: 'gm4', name: 'ASUS ROG Ally', category: 'Gadgets', price: 79999, emoji: '🎮', brand: 'ASUS', rating: 4.4, specs: 'Ryzen Z1 Extreme | 7" 120Hz | Windows 11' },

  // ACCESSORIES
  { id: 'a1', name: 'Apple Magic Keyboard', category: 'Accessories', price: 12900, emoji: '⌨️', brand: 'Apple', rating: 4.6, specs: 'Wireless | Touch ID | Scissor mechanism' },
  { id: 'a2', name: 'Logitech MX Master 3S', category: 'Accessories', price: 9999, emoji: '🖱️', brand: 'Logitech', rating: 4.8, specs: 'Wireless | 8K DPI | MagSpeed scroll' },
  { id: 'a3', name: 'Anker 100W GaN Charger', category: 'Accessories', price: 3999, emoji: '🔌', brand: 'Anker', rating: 4.7, specs: '4-port | GaN technology | Foldable' },
  { id: 'a4', name: 'Samsung 25000mAh Power Bank', category: 'Accessories', price: 4999, emoji: '🔋', brand: 'Samsung', rating: 4.5, specs: '25000mAh | 45W Fast charge | 3 ports' },
  { id: 'a5', name: 'SanDisk 1TB Portable SSD', category: 'Accessories', price: 12999, emoji: '💾', brand: 'SanDisk', brand: 'SanDisk', rating: 4.7, specs: '1050MB/s | USB-C | Shockproof' },
  { id: 'a6', name: 'LG 34" UltraWide Monitor', category: 'Accessories', price: 54999, emoji: '🖥️', brand: 'LG', rating: 4.6, specs: '34" WQHD | 144Hz | HDR | USB-C' },
  { id: 'a7', name: 'Elgato Stream Deck MK.2', category: 'Accessories', price: 14999, emoji: '🎛️', brand: 'Elgato', rating: 4.7, specs: '15 LCD keys | Customizable | USB-C' },
  { id: 'a8', name: 'UGREEN USB-C Hub 10-in-1', category: 'Accessories', price: 3499, emoji: '🔌', brand: 'UGREEN', rating: 4.5, specs: '10 ports | 4K HDMI | 100W PD | SD card' },
  { id: 'a9', name: 'Keychron K2 Pro Keyboard', category: 'Accessories', price: 8999, emoji: '⌨️', brand: 'Keychron', rating: 4.8, specs: 'Mechanical | Hot-swap | Wireless | RGB' },
  { id: 'a10', name: 'Apple AirTag (4 Pack)', category: 'Accessories', price: 11900, emoji: '🏷️', brand: 'Apple', rating: 4.5, specs: 'UWB precision | IPX7 | CR2032 battery' },
];

export const categories = ['All', 'Phones', 'Laptops', 'Gadgets', 'Accessories'];

export const getCategoryColor = (cat) => {
  const map = { Phones: 'primary', Laptops: 'success', Gadgets: 'warning', Accessories: 'info' };
  return map[cat] || 'secondary';
};
