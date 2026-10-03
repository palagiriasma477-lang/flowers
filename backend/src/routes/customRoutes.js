import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

const FLOWER_PRICES = {
  rose: 45,
  lily: 75,
  orchid: 85,
  carnation: 35,
  sunflower: 90,
  tulip: 95,
  hydrangea: 130
};

const WRAPPER_PRICES = {
  'Matte Black Luxury': 120,
  'Pearl Blush': 100,
  'Rustic Eco-Craft': 50,
  'Sage Green Silk': 110,
  'Royal Velvet Box': 350
};

const RIBBON_PRICES = {
  'Satin Gold': 40,
  'Silk Burgundy': 40,
  'Rose Gold': 50,
  'Emerald Velvet': 60
};

const ADDON_PRICES = {
  chocolates: 499,
  teddy: 399,
  vase: 349,
  greetingCard: 99
};

// Calculate custom bouquet price
router.post('/calculate', (req, res) => {
  try {
    const { flowers = {}, stems = 12, wrapper = 'Matte Black Luxury', ribbon = 'Satin Gold', addOns = [] } = req.body;

    let flowerTotal = 0;
    let totalCount = 0;

    for (const [flower, count] of Object.entries(flowers)) {
      const pricePerStem = FLOWER_PRICES[flower] || 40;
      flowerTotal += pricePerStem * (Number(count) || 0);
      totalCount += (Number(count) || 0);
    }

    // If no individual flower counts provided, calculate using stems and default average
    if (totalCount === 0) {
      flowerTotal = stems * 50;
    }

    const wrapperPrice = WRAPPER_PRICES[wrapper] || 80;
    const ribbonPrice = RIBBON_PRICES[ribbon] || 40;
    const fillers = 150; // Baby breath & foliage greenery

    let addOnsTotal = 0;
    if (Array.isArray(addOns)) {
      addOns.forEach(addonKey => {
        if (ADDON_PRICES[addonKey]) {
          addOnsTotal += ADDON_PRICES[addonKey];
        }
      });
    }

    const total = flowerTotal + wrapperPrice + ribbonPrice + fillers + addOnsTotal;

    res.json({
      success: true,
      priceBreakdown: {
        flowerTotal,
        wrapperPrice,
        ribbonPrice,
        fillers,
        addOnsTotal,
        grandTotal: total
      }
    });
  } catch (error) {
    console.error('Custom bouquet calculate error:', error);
    res.status(500).json({ success: false, message: 'Calculation failed' });
  }
});

export default router;
