import type { ViewMode, HistoricPreset } from '../context/DashboardContext';

export function getScaleFactor(
  viewMode: ViewMode,
  preset: HistoricPreset,
  dateRange: { from: string; to: string }
): number {
  if (viewMode === 'live') return 1.0;
  switch (preset) {
    case 'today': return 0.95;
    case 'yesterday': return 0.82;
    case 'last_week': return 0.68;
    case 'last_month': return 0.55;
    case 'custom': {
      if (!dateRange.from || !dateRange.to) return 0.75;
      const from = new Date(dateRange.from + 'T00:00:00');
      const to = new Date(dateRange.to + 'T00:00:00');
      const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000));
      return Math.max(0.4, 1 - days * 0.025);
    }
  }
}

interface ParsedValue {
  num: number;
  prefix: string;
  suffix: string;
  usedK: boolean;
  usedM: boolean;
  decimals: number;
}

export function parseFormattedValue(val: string): ParsedValue | null {
  if (!val || typeof val !== 'string') return null;
  let s = val.trim();
  let prefix = '';
  let suffix = '';
  let usedK = false;
  let usedM = false;

  if (s.startsWith('£')) { prefix = '£'; s = s.slice(1); }

  if (s.endsWith('%')) { suffix = '%'; s = s.slice(0, -1).trim(); }
  else if (s.endsWith(' hrs')) { suffix = ' hrs'; s = s.slice(0, -4).trim(); }
  else if (s.endsWith(' min')) { suffix = ' min'; s = s.slice(0, -4).trim(); }

  if (s.endsWith('k')) { usedK = true; s = s.slice(0, -1); }
  else if (s.endsWith('M')) { usedM = true; s = s.slice(0, -1); }

  s = s.replace(/,/g, '');
  const num = parseFloat(s);
  if (isNaN(num)) return null;

  const dotIdx = s.indexOf('.');
  const decimals = dotIdx >= 0 ? s.length - dotIdx - 1 : 0;

  const actualNum = usedK ? num * 1000 : usedM ? num * 1000000 : num;
  return { num: actualNum, prefix, suffix, usedK, usedM, decimals };
}

export function formatValue(scaled: number, parsed: ParsedValue): string {
  let num = scaled;
  let formatted: string;

  if (parsed.usedM) {
    const m = num / 1000000;
    formatted = m % 1 === 0 ? m.toFixed(0) : m.toFixed(1);
    formatted += 'M';
  } else if (parsed.usedK) {
    const k = num / 1000;
    formatted = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1);
    formatted += 'k';
  } else if (parsed.suffix === '%') {
    formatted = num.toFixed(parsed.decimals);
  } else if (parsed.suffix === ' hrs' || parsed.suffix === ' min') {
    formatted = num.toFixed(parsed.decimals);
  } else if (num >= 1000 || num <= -1000) {
    formatted = Math.round(num).toLocaleString('en-GB');
  } else if (parsed.decimals > 0) {
    formatted = num.toFixed(parsed.decimals);
  } else {
    formatted = Math.round(num).toString();
  }

  return parsed.prefix + formatted + parsed.suffix;
}

function scalePercent(num: number, factor: number): number {
  return num * (1 - (1 - factor) * 0.15);
}

export function scaleKpiItems<T extends { value: string; [k: string]: any }>(
  items: T[],
  factor: number
): T[] {
  if (factor === 1) return items;
  return items.map(item => {
    const parsed = parseFormattedValue(item.value);
    if (!parsed) return item;
    const isPercent = parsed.suffix === '%';
    const scaled = isPercent ? scalePercent(parsed.num, factor) : parsed.num * factor;
    return { ...item, value: formatValue(scaled, parsed) };
  });
}

const MONTHLY_KEYWORDS = ['(MONTH)', 'THIS MONTH'];
const WEEKLY_KEYWORDS = ['THIS WEEK', '(WEEK)'];

function filterKpisByPreset<T extends { label: string; [k: string]: any }>(
  items: T[],
  preset: HistoricPreset
): T[] {
  if (preset === 'last_month' || preset === 'custom') {
    // Month/custom: show all KPIs
    return items;
  }
  if (preset === 'last_week') {
    // Week view: hide monthly KPIs only
    return items.filter(item => {
      const upper = item.label.toUpperCase();
      return !MONTHLY_KEYWORDS.some(kw => upper.includes(kw));
    });
  }
  if (preset === 'today' || preset === 'yesterday') {
    // Day view: hide both monthly and weekly KPIs
    return items.filter(item => {
      const upper = item.label.toUpperCase();
      return !MONTHLY_KEYWORDS.some(kw => upper.includes(kw)) &&
             !WEEKLY_KEYWORDS.some(kw => upper.includes(kw));
    });
  }
  return items;
}

export function scaleGroupedKpiData<T extends Record<string, { items: Array<{ value: string; label: string; [k: string]: any }>; [k: string]: any }>>(
  grouped: T,
  factor: number,
  preset: HistoricPreset = 'today'
): T {
  if (factor === 1) return grouped;
  const result = { ...grouped };
  for (const key of Object.keys(result)) {
    const group = result[key];
    if (group && Array.isArray(group.items)) {
      const filtered = filterKpisByPreset(group.items, preset);
      (result as any)[key] = { ...group, items: scaleKpiItems(filtered, factor) };
    }
  }
  return result;
}

export function scaleNumericFields<T extends Record<string, any>>(
  data: T[],
  fields: (keyof T)[],
  factor: number
): T[] {
  if (factor === 1) return data;
  return data.map(item => {
    const copy = { ...item };
    for (const f of fields) {
      if (typeof copy[f] === 'number') {
        (copy as any)[f] = Math.round((copy[f] as number) * factor);
      }
    }
    return copy;
  });
}

export function scaleStringFields<T extends Record<string, any>>(
  data: T[],
  fields: (keyof T)[],
  factor: number
): T[] {
  if (factor === 1) return data;
  return data.map(item => {
    const copy = { ...item };
    for (const f of fields) {
      if (typeof copy[f] === 'string') {
        const parsed = parseFormattedValue(copy[f] as string);
        if (parsed) {
          (copy as any)[f] = formatValue(parsed.num * factor, parsed);
        }
      }
    }
    return copy;
  });
}

export function scaleChartJsData(
  chartData: { labels: string[]; datasets: Array<{ data: number[]; [k: string]: any }> },
  factor: number
) {
  if (factor === 1) return chartData;
  return {
    ...chartData,
    datasets: chartData.datasets.map(ds => ({
      ...ds,
      data: ds.data.map(v => Math.round(v * factor)),
    })),
  };
}
