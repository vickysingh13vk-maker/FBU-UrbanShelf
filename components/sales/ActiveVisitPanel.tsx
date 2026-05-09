import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckSquare, Square, X } from 'lucide-react';
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

  return (
    <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="text-sm font-black text-emerald-800">Active Visit</p>
            <p className="text-xs text-emerald-600 font-semibold">{visit.customerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-sm font-mono font-bold text-emerald-700">
            <Clock className="h-4 w-4" />{formatElapsed(elapsed)}
          </span>
          <button onClick={onEnd}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors">
            <X className="h-3 w-3" /> End
          </button>
        </div>
      </div>

      {visit.objectives.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-emerald-700">Objectives</p>
            <p className="text-xs text-emerald-600">{completedCount}/{totalCount}</p>
          </div>
          {visit.objectives.map(obj => (
            <button key={obj.id} onClick={() => updateVisitObjective(visit.id, obj.id, !obj.completed)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all ${
                obj.completed ? 'bg-emerald-100 border-emerald-200' : 'bg-white border-emerald-100 hover:border-emerald-300'
              }`}>
              {obj.completed
                ? <CheckSquare className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                : <Square className="h-3.5 w-3.5 text-emerald-300 flex-shrink-0" />}
              <span className={`text-xs font-semibold ${obj.completed ? 'line-through text-emerald-400' : 'text-slate-700'}`}>{obj.type}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-emerald-200">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-emerald-500" />
          <p className="text-xs text-emerald-600 font-semibold">Started {new Date(visit.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    </div>
  );
};

export default ActiveVisitPanel;
