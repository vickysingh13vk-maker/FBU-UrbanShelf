import React from 'react';
import { MapPin, AlertCircle, Clock, CheckCircle, SkipForward } from 'lucide-react';
import { RoutePlanStop } from '../../types';

interface Props {
  stop: RoutePlanStop;
  index: number;
  onVisit?: (customerId: string) => void;
  onSkip?: (customerId: string) => void;
  onClick?: (customerId: string) => void;
}

const PRIORITY_COLOR = { High: 'text-rose-600 bg-rose-50 border-rose-200', Medium: 'text-amber-600 bg-amber-50 border-amber-200', Low: 'text-slate-600 bg-slate-50 border-slate-200' };
const STATUS_STYLE = { Visited: 'opacity-60', Skipped: 'opacity-40', Pending: '' };

const RouteStop: React.FC<Props> = ({ stop, index, onVisit, onSkip, onClick }) => {
  const isVisited = stop.status === 'Visited';
  const isSkipped = stop.status === 'Skipped';

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white transition-all ${STATUS_STYLE[stop.status]} ${onClick ? 'cursor-pointer hover:border-indigo-200 hover:shadow-sm' : ''}`}
      onClick={() => onClick?.(stop.customerId)}>
      {/* Order number */}
      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
        isVisited ? 'bg-emerald-100 text-emerald-600' : isSkipped ? 'bg-slate-100 text-slate-400' : 'bg-indigo-100 text-indigo-700'
      }`}>
        {isVisited ? <CheckCircle className="h-4 w-4" /> : isSkipped ? <SkipForward className="h-4 w-4" /> : index + 1}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-bold text-slate-800 truncate">{stop.customerName}</p>
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${PRIORITY_COLOR[stop.priority]}`}>{stop.priority}</span>
        </div>
        <p className="text-xs text-slate-400 truncate flex items-center gap-1">
          <MapPin className="h-3 w-3 flex-shrink-0" />{stop.address}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3 w-3" />~{stop.estimatedVisitMinutes}m
          </span>
          {stop.lastVisitDaysAgo !== undefined && (
            <span className="text-xs text-slate-400">{stop.lastVisitDaysAgo}d ago</span>
          )}
          {stop.hasOverdueCollection && (
            <span className="flex items-center gap-1 text-xs text-rose-600 font-semibold">
              <AlertCircle className="h-3 w-3" />Collection due
            </span>
          )}
          {stop.hasOverdueFollowUp && !stop.hasOverdueCollection && (
            <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
              <AlertCircle className="h-3 w-3" />Follow-up due
            </span>
          )}
        </div>
      </div>

      {stop.status === 'Pending' && (onVisit || onSkip) && (
        <div className="flex gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
          {onVisit && (
            <button onClick={() => onVisit(stop.customerId)}
              className="px-2.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors">
              Visit
            </button>
          )}
          {onSkip && (
            <button onClick={() => onSkip(stop.customerId)}
              className="px-2.5 py-1.5 border border-slate-200 text-slate-500 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors">
              Skip
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RouteStop;
