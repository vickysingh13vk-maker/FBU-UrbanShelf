export const MOCK_SUPPLIER_ANALYTICS = {
  salesBySku: [
    { sku: 'LM-BM6000-SL', product: 'LOST MARY BM6000 KIT - Strawberry Lime', unitsSold: 4500, revenue: 17325, growth: 12.4, avgOrderSize: 38.5, conversionRate: 4.2, salesVelocity: 150 },
    { sku: 'LM-BM6000-PP', product: 'LOST MARY BM6000 KIT - Pineapple Passion Fruit', unitsSold: 3200, revenue: 12320, growth: 8.1, avgOrderSize: 35.2, conversionRate: 3.8, salesVelocity: 107 },
    { sku: 'LM-BM6000-WK', product: 'LOST MARY BM6000 KIT - Watermelon Kiwi', unitsSold: 2100, revenue: 8085, growth: -3.2, avgOrderSize: 30.1, conversionRate: 3.1, salesVelocity: 70 },
    { sku: 'LM-BM6000-RA', product: 'LOST MARY BM6000 KIT - Red Apple Ice', unitsSold: 1500, revenue: 5775, growth: 5.6, avgOrderSize: 28.9, conversionRate: 2.9, salesVelocity: 50 },
    { sku: 'LM-BM6000-BC', product: 'LOST MARY BM6000 KIT - Blue Razz Cherry', unitsSold: 800, revenue: 3080, growth: -7.5, avgOrderSize: 22.0, conversionRate: 2.1, salesVelocity: 27 },
    { sku: 'LM-BM6000-OB', product: 'LOST MARY BM6000 KIT - Orange Bruu', unitsSold: 50, revenue: 192, growth: -15.3, avgOrderSize: 12.8, conversionRate: 0.8, salesVelocity: 2 },
    { sku: 'LM-BM600-CP', product: 'LOST MARY BM600 KIT - Cherry Peach Lemonade', unitsSold: 1200, revenue: 2148, growth: 9.8, avgOrderSize: 17.9, conversionRate: 3.5, salesVelocity: 40 },
    { sku: 'LM-BM600-BA', product: 'LOST MARY BM600 KIT - Blackcurrant Apple', unitsSold: 1200, revenue: 2148, growth: 6.2, avgOrderSize: 17.9, conversionRate: 3.3, salesVelocity: 40 },
  ],
  salesByRegion: [
    { region: 'London', unitsSold: 4820, revenue: 18557, growthRate: 14.2, orders: 312 },
    { region: 'South East', unitsSold: 2450, revenue: 9432, growthRate: 8.5, orders: 178 },
    { region: 'North West', unitsSold: 2100, revenue: 8085, growthRate: 11.3, orders: 152 },
    { region: 'West Midlands', unitsSold: 1680, revenue: 6468, growthRate: 6.1, orders: 124 },
    { region: 'Yorkshire', unitsSold: 1420, revenue: 5467, growthRate: 9.7, orders: 98 },
    { region: 'East Midlands', unitsSold: 1050, revenue: 4042, growthRate: -2.4, orders: 76 },
    { region: 'South West', unitsSold: 890, revenue: 3426, growthRate: 4.8, orders: 64 },
    { region: 'North East', unitsSold: 720, revenue: 2772, growthRate: -5.1, orders: 52 },
    { region: 'Scotland', unitsSold: 650, revenue: 2502, growthRate: 7.3, orders: 48 },
    { region: 'Wales', unitsSold: 420, revenue: 1617, growthRate: 3.2, orders: 34 },
  ],
  salesByTime: [
    { month: 'Nov 2025', unitsSold: 9200, revenue: 35420, orders: 680 },
    { month: 'Dec 2025', unitsSold: 11500, revenue: 44275, orders: 820 },
    { month: 'Jan 2026', unitsSold: 10800, revenue: 41580, orders: 790 },
    { month: 'Feb 2026', unitsSold: 12400, revenue: 47740, orders: 910 },
    { month: 'Mar 2026', unitsSold: 14550, revenue: 56017, orders: 1050 },
    { month: 'Apr 2026', unitsSold: 5200, revenue: 20020, orders: 380 },
  ],
  insights: {
    winningSKUs: [
      { sku: 'LM-BM6000-SL', product: 'Strawberry Lime', growth: 12.4 },
      { sku: 'LM-BM600-CP', product: 'Cherry Peach Lemonade', growth: 9.8 },
      { sku: 'LM-BM6000-PP', product: 'Pineapple Passion Fruit', growth: 8.1 },
    ],
    decliningSKUs: [
      { sku: 'LM-BM6000-OB', product: 'Orange Bruu', decline: -15.3 },
      { sku: 'LM-BM6000-BC', product: 'Blue Razz Cherry', decline: -7.5 },
      { sku: 'LM-BM6000-WK', product: 'Watermelon Kiwi', decline: -3.2 },
    ]
  }
};
