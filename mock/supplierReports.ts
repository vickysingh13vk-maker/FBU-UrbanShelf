export const MOCK_SUPPLIER_REPORTS = {
  templates: [
    { id: 'RPT-T01', name: 'Monthly Sales Summary', type: 'Sales', description: 'Overview of sales performance including revenue, units sold, and order trends for the selected period.', formats: ['CSV', 'Excel'] as string[], lastGenerated: '2026-03-31', frequency: 'Monthly' },
    { id: 'RPT-T02', name: 'SKU Performance Report', type: 'Sales', description: 'Detailed breakdown of sales metrics per SKU including velocity, growth rate, and conversion.', formats: ['CSV', 'Excel'] as string[], lastGenerated: '2026-03-28', frequency: 'Weekly' },
    { id: 'RPT-T03', name: 'Inventory Snapshot', type: 'Inventory', description: 'Current stock levels across all warehouses with health indicators and reorder recommendations.', formats: ['CSV', 'Excel'] as string[], lastGenerated: '2026-04-01', frequency: 'Daily' },
    { id: 'RPT-T04', name: 'Warehouse Movement Report', type: 'Inventory', description: 'Track all inventory movements including inbound shipments, outbound orders, and stock adjustments.', formats: ['CSV', 'Excel'] as string[], lastGenerated: '2026-03-30', frequency: 'Weekly' },
    { id: 'RPT-T05', name: 'Demand Forecast', type: 'Forecast', description: 'Predicted demand for the next 4 weeks based on historical trends and seasonal patterns.', formats: ['Excel'] as string[], lastGenerated: '2026-03-25', frequency: 'Monthly' },
    { id: 'RPT-T06', name: 'Stock-Out Risk Report', type: 'Forecast', description: 'Identifies SKUs at risk of stock-out within the next 14 days with recommended production quantities.', formats: ['CSV', 'Excel'] as string[], lastGenerated: null, frequency: 'On-demand' },
  ],
  history: [
    { id: 'RPT-H01', reportName: 'Monthly Sales Summary', type: 'Sales', generatedDate: '2026-03-31', format: 'Excel', fileSize: '2.4 MB', status: 'Completed' },
    { id: 'RPT-H02', reportName: 'Inventory Snapshot', type: 'Inventory', generatedDate: '2026-04-01', format: 'CSV', fileSize: '1.1 MB', status: 'Completed' },
    { id: 'RPT-H03', reportName: 'SKU Performance Report', type: 'Sales', generatedDate: '2026-03-28', format: 'Excel', fileSize: '3.2 MB', status: 'Completed' },
    { id: 'RPT-H04', reportName: 'Warehouse Movement Report', type: 'Inventory', generatedDate: '2026-03-30', format: 'CSV', fileSize: '890 KB', status: 'Completed' },
    { id: 'RPT-H05', reportName: 'Demand Forecast', type: 'Forecast', generatedDate: '2026-03-25', format: 'Excel', fileSize: '1.8 MB', status: 'Completed' },
    { id: 'RPT-H06', reportName: 'Monthly Sales Summary', type: 'Sales', generatedDate: '2026-02-28', format: 'Excel', fileSize: '2.1 MB', status: 'Completed' },
    { id: 'RPT-H07', reportName: 'Inventory Snapshot', type: 'Inventory', generatedDate: '2026-03-25', format: 'Excel', fileSize: '1.3 MB', status: 'Completed' },
    { id: 'RPT-H08', reportName: 'SKU Performance Report', type: 'Sales', generatedDate: '2026-03-21', format: 'CSV', fileSize: '2.8 MB', status: 'Completed' },
    { id: 'RPT-H09', reportName: 'Demand Forecast', type: 'Forecast', generatedDate: '2026-04-02', format: 'Excel', fileSize: '0 KB', status: 'Processing' },
    { id: 'RPT-H10', reportName: 'Stock-Out Risk Report', type: 'Forecast', generatedDate: '2026-03-15', format: 'CSV', fileSize: '0 KB', status: 'Failed' },
  ]
};
