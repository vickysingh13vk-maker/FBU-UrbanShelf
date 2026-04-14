import { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  getScaleFactor,
  scaleNumericFields,
  scaleKpiItems,
  scaleGroupedKpiData,
  scaleStringFields,
  scaleChartJsData,
} from '../utils/historicDataUtils';

import {
  GROUPED_KPI_DATA as _GROUPED_KPI_DATA,
  REVENUE_TREND_DATA as _REVENUE_TREND_DATA,
  REVENUE_COLLECTIONS_DATA as _REVENUE_COLLECTIONS_DATA,
  DAILY_ORDERS_ACTIVITY_DATA as _DAILY_ORDERS_ACTIVITY_DATA,
  SALES_BY_TERRITORY_DATA as _SALES_BY_TERRITORY_DATA,
  REP_PERFORMANCE_TREND as _REP_PERFORMANCE_TREND,
  STOCK_MOVEMENT_CHART_DATA as _STOCK_MOVEMENT_CHART_DATA,
  SUPPLIER_SHARE_DATA as _SUPPLIER_SHARE_DATA,
  PURCHASE_SOURCE_DATA as _PURCHASE_SOURCE_DATA,
  POUCH_SUPPLIER_DATA as _POUCH_SUPPLIER_DATA,
  VISIT_TYPE_DATA as _VISIT_TYPE_DATA,
  SURVEY_DM_DATA as _SURVEY_DM_DATA,
  SURVEY_STOCKING_DATA as _SURVEY_STOCKING_DATA,
  DECISION_MAKER_DATA as _DECISION_MAKER_DATA,
  PAYMENT_STATUS_DATA as _PAYMENT_STATUS_DATA,
  TOP_SELLING_DATA as _TOP_SELLING_DATA,
  TOP_SELLING_PRODUCTS_DATA as _TOP_SELLING_PRODUCTS_DATA,
  WAREHOUSE_OPS_DATA as _WAREHOUSE_OPS_DATA,
  LOW_STOCK_PRODUCTS_DATA as _LOW_STOCK_PRODUCTS_DATA,
  TOP_VALUE_PRODUCTS_DATA as _TOP_VALUE_PRODUCTS_DATA,
  REP_VISIT_DATA_DASHBOARD as _REP_VISIT_DATA_DASHBOARD,
  CUSTOMER_LOCATIONS as _CUSTOMER_LOCATIONS,
  CUSTOMER_BALANCE_RANKING as _CUSTOMER_BALANCE_RANKING,
  RECENT_ORDERS as _RECENT_ORDERS,
  CUSTOMER_LEDGER_PREVIEW_DATA as _CUSTOMER_LEDGER_PREVIEW_DATA,
  TOP_CUSTOMERS_DATA as _TOP_CUSTOMERS_DATA,
  ACTIVE_CARTS_DATA as _ACTIVE_CARTS_DATA,
  CREDIT_RISK_CUSTOMERS_DATA as _CREDIT_RISK_CUSTOMERS_DATA,
  TEAM_TOTALS as _TEAM_TOTALS,
  BRAND_SKU_MOVEMENT_DATA as _BRAND_SKU_MOVEMENT_DATA,
  TOP_BRAND_BREAKDOWN_DATA as _TOP_BRAND_BREAKDOWN_DATA,
  WORST_PERFORMING_SKUS as _WORST_PERFORMING_SKUS,
} from '../data/dashboardData';

export function useHistoricData() {
  const { viewMode, historicPreset, historicDateRange } = useDashboard();

  const factor = useMemo(
    () => getScaleFactor(viewMode, historicPreset, historicDateRange),
    [viewMode, historicPreset, historicDateRange]
  );

  return useMemo(() => ({
    factor,
    isHistoric: viewMode === 'historic',

    // Grouped KPIs (all panels)
    GROUPED_KPI_DATA: scaleGroupedKpiData(_GROUPED_KPI_DATA, factor, historicPreset),

    // Chart arrays (numeric)
    REVENUE_TREND_DATA: scaleNumericFields(_REVENUE_TREND_DATA, ['revenue', 'target'], factor),
    REVENUE_COLLECTIONS_DATA: scaleNumericFields(_REVENUE_COLLECTIONS_DATA, ['revenue', 'collected'], factor),
    DAILY_ORDERS_ACTIVITY_DATA: scaleNumericFields(_DAILY_ORDERS_ACTIVITY_DATA, ['created', 'completed', 'blocked'], factor),
    SALES_BY_TERRITORY_DATA: scaleNumericFields(_SALES_BY_TERRITORY_DATA, ['value'], factor),
    REP_PERFORMANCE_TREND: scaleNumericFields(_REP_PERFORMANCE_TREND, ['sales'], factor),
    STOCK_MOVEMENT_CHART_DATA: scaleChartJsData(_STOCK_MOVEMENT_CHART_DATA, factor),

    // Pie chart arrays (numeric)
    SUPPLIER_SHARE_DATA: scaleNumericFields(_SUPPLIER_SHARE_DATA, ['value'], factor),
    PURCHASE_SOURCE_DATA: scaleNumericFields(_PURCHASE_SOURCE_DATA, ['value'], factor),
    POUCH_SUPPLIER_DATA: scaleNumericFields(_POUCH_SUPPLIER_DATA, ['value'], factor),
    VISIT_TYPE_DATA: scaleNumericFields(_VISIT_TYPE_DATA, ['value'], factor),
    SURVEY_DM_DATA: scaleNumericFields(_SURVEY_DM_DATA, ['value'], factor),
    SURVEY_STOCKING_DATA: scaleNumericFields(_SURVEY_STOCKING_DATA, ['value'], factor),
    DECISION_MAKER_DATA: scaleNumericFields(_DECISION_MAKER_DATA, ['value'], factor),
    PAYMENT_STATUS_DATA: scaleNumericFields(_PAYMENT_STATUS_DATA, ['value'], factor),
    TOP_SELLING_DATA: scaleNumericFields(_TOP_SELLING_DATA, ['value'], factor),

    // Tables with numeric fields
    TOP_SELLING_PRODUCTS_DATA: scaleNumericFields(_TOP_SELLING_PRODUCTS_DATA, ['boxes', 'units'], factor),
    WAREHOUSE_OPS_DATA: scaleNumericFields(_WAREHOUSE_OPS_DATA, ['load', 'picking', 'packing', 'shipped'], factor),
    LOW_STOCK_PRODUCTS_DATA: scaleNumericFields(_LOW_STOCK_PRODUCTS_DATA, ['stock'], factor),
    TOP_VALUE_PRODUCTS_DATA: scaleNumericFields(_TOP_VALUE_PRODUCTS_DATA, ['value'], factor),
    REP_VISIT_DATA_DASHBOARD: scaleNumericFields(_REP_VISIT_DATA_DASHBOARD, ['visits', 'appCount', 'boxesSold', 'salesCount'], factor),
    CUSTOMER_LOCATIONS: scaleNumericFields(_CUSTOMER_LOCATIONS, ['count'], factor),

    // Tables with formatted-string currency fields
    CUSTOMER_BALANCE_RANKING: scaleStringFields(_CUSTOMER_BALANCE_RANKING, ['outstanding', 'overdue'], factor),
    RECENT_ORDERS: scaleStringFields(_RECENT_ORDERS, ['amount'], factor),
    CUSTOMER_LEDGER_PREVIEW_DATA: scaleStringFields(_CUSTOMER_LEDGER_PREVIEW_DATA, ['paid', 'balance', 'overdue'], factor),
    TOP_CUSTOMERS_DATA: scaleStringFields(_TOP_CUSTOMERS_DATA, ['revenue'], factor),
    ACTIVE_CARTS_DATA: scaleStringFields(_ACTIVE_CARTS_DATA, ['value'], factor),
    CREDIT_RISK_CUSTOMERS_DATA: scaleStringFields(_CREDIT_RISK_CUSTOMERS_DATA, ['balance', 'limit'], factor),
    TEAM_TOTALS: scaleStringFields(_TEAM_TOTALS, ['value'], factor),

    // Inventory analytics
    BRAND_SKU_MOVEMENT_DATA: scaleNumericFields(_BRAND_SKU_MOVEMENT_DATA, ['fast', 'slow', 'dead'], factor),
    TOP_BRAND_BREAKDOWN_DATA: scaleNumericFields(_TOP_BRAND_BREAKDOWN_DATA, ['fast', 'slow', 'dead'], factor),
    WORST_PERFORMING_SKUS: scaleNumericFields(_WORST_PERFORMING_SKUS, ['sales', 'stock'], factor),
  }), [factor, viewMode, historicPreset]);
}
