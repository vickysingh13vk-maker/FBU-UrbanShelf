import React, { useState } from 'react';
import { Mail, Phone, Calendar, Star, Clock, MessageSquare, Users } from 'lucide-react';
import { Card, Button, Badge, Table, THead, TBody, TR, TH, TD, Toast } from '../../components/ui';

const ACCOUNT_MANAGER = {
  name: 'David Richardson',
  role: 'Senior Account Manager',
  email: 'david.richardson@urbanshelf.co.uk',
  phone: '+44 20 7946 0958',
  avatar: 'https://ui-avatars.com/api/?name=David+Richardson&background=4f46e5&color=fff&size=128',
};

const STRATEGY_NOTES = [
  { id: 1, date: '2026-04-01', note: 'Focus on expanding BM6000 range into North East region - untapped potential identified.' },
  { id: 2, date: '2026-03-25', note: 'Recommend increasing buffer stock for Cherry Peach Lemonade ahead of Q2 demand surge.' },
  { id: 3, date: '2026-03-18', note: 'Review pricing strategy for Orange Bruu - consider 15% promotional discount to clear stock.' },
  { id: 4, date: '2026-03-10', note: 'Schedule quarterly business review with supplier leadership for strategic alignment.' },
];

const PERFORMANCE_FEEDBACK = {
  responseTime: '2.4 hours',
  resolutionRate: 96.8,
  satisfactionScore: 4.7,
  totalInteractions: 142,
  avgResolutionTime: '18 hours',
};

const COMMUNICATION_HISTORY = [
  { id: 1, date: '2026-04-02', subject: 'Q2 Demand Forecast Review', type: 'Meeting', status: 'Completed' },
  { id: 2, date: '2026-03-30', subject: 'Stock Replenishment Recommendation', type: 'Email', status: 'Completed' },
  { id: 3, date: '2026-03-25', subject: 'Pricing Strategy Discussion', type: 'Call', status: 'Completed' },
  { id: 4, date: '2026-03-20', subject: 'New Region Expansion Plan', type: 'Email', status: 'Completed' },
  { id: 5, date: '2026-03-15', subject: 'Monthly Performance Review', type: 'Meeting', status: 'Completed' },
  { id: 6, date: '2026-04-08', subject: 'Q2 Launch Strategy Meeting', type: 'Meeting', status: 'Scheduled' },
  { id: 7, date: '2026-04-05', subject: 'Promotion Effectiveness Report', type: 'Email', status: 'Pending' },
];

const SupplierAccountManager: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Meeting':
        return <Badge variant="primary">{type}</Badge>;
      case 'Email':
        return <Badge variant="info">{type}</Badge>;
      case 'Call':
        return <Badge variant="success">{type}</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">{status}</Badge>;
      case 'Scheduled':
        return <Badge variant="info">{status}</Badge>;
      case 'Pending':
        return <Badge variant="warning">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Manager</h1>
        <p className="text-slate-500 mt-1 font-medium">Your dedicated account manager and communication hub</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Contact Card */}
          <Card className="p-5">
            <div className="text-center mb-4">
              <img
                src={ACCOUNT_MANAGER.avatar}
                alt={ACCOUNT_MANAGER.name}
                className="h-20 w-20 rounded-full mx-auto mb-3"
              />
              <h2 className="text-xl font-bold text-slate-900">{ACCOUNT_MANAGER.name}</h2>
              <p className="text-sm text-slate-500">{ACCOUNT_MANAGER.role}</p>
            </div>
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">{ACCOUNT_MANAGER.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">{ACCOUNT_MANAGER.phone}</span>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setToast({ message: 'Meeting scheduler opened', type: 'info' })}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setToast({ message: 'Email client opened', type: 'info' })}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </Card>

          {/* Strategy Notes */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Strategy Notes</h3>
            <div className="space-y-0">
              {STRATEGY_NOTES.map((item, index) => (
                <div
                  key={item.id}
                  className={`py-3 ${index < STRATEGY_NOTES.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <p className="text-xs text-slate-400 mb-1">{item.date}</p>
                  <p className="text-sm text-slate-700">{item.note}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Performance Metrics */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs font-medium text-slate-500">Response Time</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{PERFORMANCE_FEEDBACK.responseTime}</p>
                <p className="text-xs text-slate-400">avg</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-medium text-slate-500">Resolution Rate</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{PERFORMANCE_FEEDBACK.resolutionRate}%</p>
                <div className="mt-1.5 w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: `${PERFORMANCE_FEEDBACK.resolutionRate}%` }}
                  />
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-medium text-slate-500">Satisfaction</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {PERFORMANCE_FEEDBACK.satisfactionScore}
                  <span className="text-sm font-normal text-slate-400">/5.0</span>
                </p>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= Math.round(PERFORMANCE_FEEDBACK.satisfactionScore)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-violet-500" />
                  <span className="text-xs font-medium text-slate-500">Total Interactions</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{PERFORMANCE_FEEDBACK.totalInteractions}</p>
                <p className="text-xs text-slate-400">all time</p>
              </div>
            </div>
          </Card>

          {/* Communication History */}
          <Card padding="none">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Communication History</h3>
            </div>
            <Table>
              <THead>
                <TR>
                  <TH>Date</TH>
                  <TH>Subject</TH>
                  <TH>Type</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {COMMUNICATION_HISTORY.map((record) => (
                  <TR key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TD className="text-slate-600">{record.date}</TD>
                    <TD className="font-medium text-slate-900">{record.subject}</TD>
                    <TD>{getTypeBadge(record.type)}</TD>
                    <TD>{getStatusBadge(record.status)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierAccountManager;
