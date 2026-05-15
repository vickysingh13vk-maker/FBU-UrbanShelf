import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckSquare, Square, X, Zap } from 'lucide-react';
import { Visit } from '../../types';
import { useSalesExecution } from '../../context/SalesExecutionContext';

interface Props {
  visit: Visit;
  onEnd: () => void;
}

const ActiveVisitPanel: React.FC<Props> = ({ visit, onEnd }) => {
  const { updateVisitObjective } = useSalesExecution();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(visit.startTime).getTime();
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [visit.startTime]);

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const completedCount = visit.objectives.filter(o => o.completed).length;
  const totalCount = visit.objectives.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/60 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-shrink-0">
            <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-200">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-black text-emerald-800 uppercase tracking-wider leading-none">Active Visit</p>
            <p className="text-sm font-bold text-emerald-700 mt-0.5 leading-none">{visit.customerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Timer */}
          <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-xl">
            <Clock className="h-3.5 w-3.5 opacity-80" />
            <span className="text-sm font-mono font-bold tabular-nums">{formatElapsed(elapsed)}</span>
          </div>
          <button
            onClick={onEnd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-emerald-700 text-xs font-bold rounded-xl transition-all">
            <X className="h-3 w-3" /> End
          </button>
        </div>
      </div>

      {/* Body */}
      {visit.objectives.length > 0 && (
        <div className="px-4 py-3 space-y-2.5">
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-emerald-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-600 tabular-nums">{completedCount}/{totalCount}</span>
          </div>

          {/* Objectives */}
          <div className="grid grid-cols-2 gap-1.5">
            {visit.objectives.map(obj => (
              <button key={obj.id}
                onClick={() => updateVisitObjective(visit.id, obj.id, !obj.completed)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all ${
                  obj.completed
                    ? 'bg-emerald-100 border-emerald-200'
                    : 'bg-white/80 border-emerald-100 hover:border-emerald-300'
                }`}>
                {obj.completed
                  ? <CheckSquare className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  : <Square className="h-3.5 w-3.5 text-emerald-300 flex-shrink-0" />}
                <span className={`text-xs font-semibold truncate ${obj.completed ? 'line-through text-emerald-400' : 'text-slate-700'}`}>
                  {obj.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-1.5 px-4 pb-3 pt-1">
        <MapPin className="h-3 w-3 text-emerald-400 flex-shrink-0" />
        <p className="text-xs text-emerald-500 font-medium">
          Started {new Date(visit.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ActiveVisitPanel;
