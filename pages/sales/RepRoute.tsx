import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Card } from '../../components/ui';
import RouteStop from '../../components/sales/RouteStop';
import VisitWorkflowModal from '../../components/sales/VisitWorkflowModal';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useAuth } from '../../context/AuthContext';

const RepRoute: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTodayRoute, markStopVisited, markStopSkipped, getActiveVisit } = useSalesExecution();

  const [visitModal, setVisitModal] = useState<{ customerId: string; customerName: string } | null>(null);

  const repId = user?.id ?? '';
  const todayRoute = getTodayRoute(repId);
  const activeVisit = getActiveVisit(repId);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const stops = todayRoute?.stops.slice().sort((a, b) => a.suggestedOrder - b.suggestedOrder) ?? [];
  const visited = stops.filter(s => s.status === 'Visited').length;
  const pending = stops.filter(s => s.status === 'Pending').length;
  const overdueStops = stops.filter(s => s.hasOverdueCollection || s.hasOverdueFollowUp).length;
  const estimatedMin = todayRoute?.estimatedTotalMinutes ?? 0;

  const handleStartVisit = (customerId: string, customerName: string) => {
    if (activeVisit) return;
    setVisitModal({ customerId, customerName });
  };

  const handleVisitComplete = (visitId: string) => {
    if (visitModal) markStopVisited(repId, visitModal.customerId);
    setVisitModal(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Today's Route</h1>
          <p className="text-sm text-slate-500 mt-1">{today}</p>
        </div>
        {activeVisit && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700">Visit Active: {activeVisit.customerName}</span>
          </div>
        )}
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Stops', value: stops.length, color: 'text-slate-800', icon: <MapPin className="h-4 w-4 text-slate-400" /> },
          { label: 'Visited', value: visited, color: 'text-emerald-600', icon: <CheckCircle className="h-4 w-4 text-emerald-400" /> },
          { label: 'Remaining', value: pending, color: 'text-indigo-600', icon: <Clock className="h-4 w-4 text-indigo-400" /> },
          { label: 'Alerts', value: overdueStops, color: 'text-rose-600', icon: <AlertCircle className="h-4 w-4 text-rose-400" /> },
        ].map(s => (
          <Card key={s.label} padding="md">
            <div className="flex items-center gap-1.5 mb-1">{s.icon}</div>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </Card>
        ))}
      </div>

      {estimatedMin > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl text-sm">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600">Estimated time: <strong className="text-slate-800">{Math.floor(estimatedMin / 60)}h {estimatedMin % 60}m</strong></span>
        </div>
      )}

      {/* Stop list */}
      {stops.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <MapPin className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No route planned for today</p>
          <p className="text-xs text-slate-300 mt-1">Route plans are set by your manager</p>
        </Card>
      ) : (
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">Stops ({stops.length})</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-400"><div className="h-2 w-2 rounded-full bg-emerald-400" />Visited</span>
              <span className="flex items-center gap-1 text-slate-400"><div className="h-2 w-2 rounded-full bg-slate-300" />Skipped</span>
            </div>
          </div>
          <div className="space-y-2">
            {stops.map((stop, i) => (
              <RouteStop key={stop.customerId} stop={stop} index={i}
                onVisit={stop.status === 'Pending' && !activeVisit ? () => handleStartVisit(stop.customerId, stop.customerName) : undefined}
                onSkip={stop.status === 'Pending' ? () => markStopSkipped(repId, stop.customerId) : undefined}
                onClick={() => navigate(`/sales/customers/${stop.customerId}`)}
              />
            ))}
          </div>
        </Card>
      )}

      {activeVisit && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs font-bold text-amber-700">Visit in progress — complete or end current visit before starting next stop.</p>
        </div>
      )}

      {visitModal && !activeVisit && (
        <VisitWorkflowModal
          customerId={visitModal.customerId}
          customerName={visitModal.customerName}
          onComplete={handleVisitComplete}
          onClose={() => setVisitModal(null)}
        />
      )}
    </div>
  );
};

export default RepRoute;
