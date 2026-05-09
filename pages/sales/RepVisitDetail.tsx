import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckSquare, Square, Star, Package, Banknote, FileText, Calendar, StopCircle } from 'lucide-react';
import { Card } from '../../components/ui';
import { useSalesExecution } from '../../context/SalesExecutionContext';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  planned:   { bg: 'bg-blue-50',    text: 'text-blue-700' },
  active:    { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  cancelled: { bg: 'bg-slate-50',   text: 'text-slate-500' },
};

const RepVisitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVisitById, updateVisitObjective, endVisit } = useSalesExecution();

  const visit = getVisitById(id ?? '');

  if (!visit) {
    return (
      <div className="space-y-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <Card padding="lg" className="text-center py-16">
          <p className="text-sm text-slate-400">Visit not found</p>
        </Card>
      </div>
    );
  }

  const cfg = STATUS_COLORS[visit.status] ?? STATUS_COLORS.planned;
  const completedObjectives = visit.objectives.filter(o => o.completed).length;
  const startTime = new Date(visit.startTime);
  const endTime = visit.endTime ? new Date(visit.endTime) : null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-slate-800 truncate">{visit.customerName}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {visit.date} · {startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text} capitalize`}>
          {visit.status}
        </span>
      </div>

      {/* Time Summary */}
      <Card padding="md">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">Start</span>
            </div>
            <p className="text-base font-black text-slate-800">
              {startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="text-center border-x border-slate-100">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">Duration</span>
            </div>
            <p className="text-base font-black text-slate-800">
              {visit.durationMinutes
                ? visit.durationMinutes >= 60
                  ? `${Math.floor(visit.durationMinutes / 60)}h ${visit.durationMinutes % 60}m`
                  : `${visit.durationMinutes}m`
                : visit.status === 'active' ? 'Active' : '—'}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">End</span>
            </div>
            <p className="text-base font-black text-slate-800">
              {endTime
                ? endTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                : '—'}
            </p>
          </div>
        </div>
      </Card>

      {/* Objectives */}
      {visit.objectives.length > 0 && (
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">Objectives</h3>
            <span className="text-xs text-slate-400">{completedObjectives}/{visit.objectives.length} completed</span>
          </div>
          <div className="space-y-2">
            {visit.objectives.map(obj => (
              <button
                key={obj.id}
                onClick={() => visit.status === 'active' && updateVisitObjective(visit.id, obj.id, !obj.completed)}
                disabled={visit.status !== 'active'}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  obj.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'
                } ${visit.status === 'active' ? 'cursor-pointer hover:border-indigo-200 hover:bg-indigo-50' : 'cursor-default'}`}>
                {obj.completed
                  ? <CheckSquare className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  : <Square className="h-4 w-4 text-slate-300 flex-shrink-0" />}
                <span className={`text-sm font-semibold flex-1 ${obj.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {obj.type}
                </span>
                {obj.description && (
                  <span className="text-xs text-slate-400 truncate">{obj.description}</span>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Outcome */}
      {visit.outcome && (
        <Card padding="md">
          <h3 className="text-sm font-bold text-slate-700 mb-3">Outcome</h3>
          <div className="space-y-3">
            {visit.outcome.orderAmount !== undefined && visit.outcome.orderAmount > 0 && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                <Package className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-emerald-600 font-semibold">Order Placed</p>
                  <p className="text-base font-black text-emerald-700">£{visit.outcome.orderAmount.toFixed(2)}</p>
                </div>
              </div>
            )}

            {visit.outcome.collectionAmount !== undefined && visit.outcome.collectionAmount > 0 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <Banknote className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-600 font-semibold">Collection</p>
                  <p className="text-base font-black text-blue-700">£{visit.outcome.collectionAmount.toFixed(2)}</p>
                </div>
              </div>
            )}

            {visit.outcome.customerSatisfaction && (
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-slate-500">Satisfaction:</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star key={n} className={`h-4 w-4 ${n <= visit.outcome!.customerSatisfaction! ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
            )}

            {visit.outcome.productsDiscussed.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5">Products Discussed</p>
                <div className="flex flex-wrap gap-1.5">
                  {visit.outcome.productsDiscussed.map(p => (
                    <span key={p} className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">{p}</span>
                  ))}
                </div>
              </div>
            )}

            {visit.outcome.notes && (
              <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl">
                <FileText className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600">{visit.outcome.notes}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Meta */}
      <Card padding="md">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Details</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 text-xs">Rep</span>
            <span className="font-semibold text-slate-700">{visit.repName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 text-xs">Visit ID</span>
            <span className="font-mono text-xs text-slate-500">{visit.id}</span>
          </div>
          {visit.followUpId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 text-xs">Follow-Up Created</span>
              <button onClick={() => navigate('/sales/follow-ups')}
                className="flex items-center gap-1 text-indigo-600 text-xs font-semibold hover:text-indigo-800">
                <Calendar className="h-3.5 w-3.5" />
                View Follow-Ups →
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Notes */}
      {visit.notes && (
        <Card padding="md">
          <h3 className="text-sm font-bold text-slate-700 mb-2">Notes</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{visit.notes}</p>
        </Card>
      )}

      <div className="flex gap-3">
        {visit.status === 'active' && (
          <button
            onClick={() => { endVisit(visit.id, { productsDiscussed: [], notes: 'Ended from visit detail.' }); navigate('/sales/visits'); }}
            className="flex items-center gap-2 px-5 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-colors">
            <StopCircle className="h-4 w-4" /> End Visit
          </button>
        )}
        <button onClick={() => navigate(`/sales/customers/${visit.customerId}`)}
          className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          View Customer →
        </button>
      </div>
    </div>
  );
};

export default RepVisitDetail;
