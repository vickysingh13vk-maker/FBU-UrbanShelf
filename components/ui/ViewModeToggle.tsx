import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Activity, Calendar, ChevronRight, Info } from 'lucide-react';
import { useDashboard, type HistoricPreset } from '../../context/DashboardContext';

const PRESETS: { key: HistoricPreset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last_week', label: 'Last Week' },
  { key: 'last_month', label: 'Last Month' },
  { key: 'custom', label: 'Custom Range' },
];

function formatDateLabel(preset: HistoricPreset, from: string, to: string): string {
  const fmt = (d: string) => {
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const today = new Date();
  const todayStr = fmt(today.toISOString().slice(0, 10));

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = fmt(yesterday.toISOString().slice(0, 10));

  switch (preset) {
    case 'today':
      return `Today (${todayStr})`;
    case 'yesterday':
      return `Yesterday (${yesterdayStr})`;
    case 'last_week': {
      const end = new Date(today);
      end.setDate(end.getDate() - 1);
      const start = new Date(today);
      start.setDate(start.getDate() - 7);
      return `Last 7 Days (${fmt(start.toISOString().slice(0, 10))} – ${fmt(end.toISOString().slice(0, 10))})`;
    }
    case 'last_month': {
      const end = new Date(today);
      end.setDate(end.getDate() - 1);
      const start = new Date(today);
      start.setDate(start.getDate() - 30);
      return `Last 30 Days (${fmt(start.toISOString().slice(0, 10))} – ${fmt(end.toISOString().slice(0, 10))})`;
    }
    case 'custom':
      return from && to ? `${fmt(from)} – ${fmt(to)}` : 'Select a date range';
  }
}

export const ViewModeToggle: React.FC = () => {
  const {
    viewMode, setViewMode,
    historicPreset, setHistoricPreset,
    historicDateRange, setHistoricDateRange,
  } = useDashboard();

  const dateLabel = useMemo(
    () => formatDateLabel(historicPreset, historicDateRange.from, historicDateRange.to),
    [historicPreset, historicDateRange]
  );

  return (
    <div className="w-full space-y-3">
      {/* Toggle pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('live')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
              viewMode === 'live'
                ? 'bg-white shadow-sm text-emerald-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {viewMode === 'live' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${viewMode === 'live' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </span>
            Live
          </button>
          <button
            onClick={() => setViewMode('historic')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
              viewMode === 'historic'
                ? 'bg-white shadow-sm text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock className="h-3 w-3" />
            Historic
          </button>
        </div>

        {viewMode === 'live' && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <Activity className="h-3.5 w-3.5" />
            <span>Real-time data</span>
          </div>
        )}
      </div>

      {/* Historic filter bar */}
      <AnimatePresence>
        {viewMode === 'historic' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-3">
              {/* Preset pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Period:
                </div>
                {PRESETS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setHistoricPreset(p.key)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 ${
                      historicPreset === p.key
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Custom date inputs */}
              <AnimatePresence>
                {historicPreset === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="text-xs font-medium text-slate-500">From:</label>
                      <input
                        type="date"
                        value={historicDateRange.from}
                        onChange={(e) => setHistoricDateRange({ ...historicDateRange, from: e.target.value })}
                        className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      />
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      <label className="text-xs font-medium text-slate-500">To:</label>
                      <input
                        type="date"
                        value={historicDateRange.to}
                        onChange={(e) => setHistoricDateRange({ ...historicDateRange, to: e.target.value })}
                        className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info banner */}
              <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                <Info className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                <span className="text-xs font-medium text-indigo-700">
                  Showing data for: {dateLabel}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
