import React, { useState, useMemo } from 'react';
import { FileText, Download, Clock, XCircle, BarChart3, Package, TrendingUp } from 'lucide-react';
import { Card, Button, Badge, Table, THead, TBody, TR, TH, TD, Pagination, Toast } from '../../components/ui';
import { useSupplier } from '../../context/SupplierContext';
import { REPORT_STATUS_CONFIG } from '../../constants/supplierStatus';
import type { ReportTemplate, ReportHistoryItem } from '../../types';

const SupplierReports: React.FC = () => {
  const { reports } = useSupplier();
  const [activeTab, setActiveTab] = useState<'Sales' | 'Inventory' | 'Forecast'>('Sales');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const tabs = [
    { key: 'Sales' as const, label: 'Sales Reports', icon: BarChart3 },
    { key: 'Inventory' as const, label: 'Inventory Reports', icon: Package },
    { key: 'Forecast' as const, label: 'Forecast Reports', icon: TrendingUp },
  ];

  const filteredTemplates = useMemo(() => {
    return reports.templates.filter((t) => t.type === activeTab);
  }, [reports.templates, activeTab]);


  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return reports.history.slice(start, start + itemsPerPage);
  }, [reports.history, currentPage]);

  const handleGenerate = (name: string) => {
    setToast({ message: `Report generation started for "${name}"`, type: 'info' });
  };

  const statusIcons: Record<string, React.ReactNode> = {
    Processing: <Clock className="h-3 w-3 mr-1 inline" />,
    Failed: <XCircle className="h-3 w-3 mr-1 inline" />,
  };

  const getStatusBadge = (status: string) => {
    const config = REPORT_STATUS_CONFIG[status];
    if (!config) return <Badge>{status}</Badge>;
    return (
      <Badge variant={config.variant}>
        {statusIcons[status]}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h1>
        <p className="text-slate-500 mt-1 font-medium">Generate and download supplier reports</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="h-4 w-4 inline mr-1.5 -mt-0.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Report Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <Badge variant="info">{template.frequency}</Badge>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">{template.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{template.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {template.formats.map((format) => (
                <span
                  key={format}
                  className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full"
                >
                  {format}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {template.lastGenerated
                ? `Last generated: ${template.lastGenerated}`
                : 'Never generated'}
            </p>
            <Button variant="primary" size="sm" onClick={() => handleGenerate(template.name)}>
              Generate Report
            </Button>
          </Card>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">
            No report templates available for this category.
          </div>
        )}
      </div>

      {/* Report History */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-4">Report History</h2>
        <Card padding="none">
          <Table>
            <THead>
              <TR>
                <TH>Report Name</TH>
                <TH>Type</TH>
                <TH>Generated Date</TH>
                <TH>Format</TH>
                <TH>File Size</TH>
                <TH>Status</TH>
                <TH>Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedHistory.map((record) => (
                <TR key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TD className="font-medium text-slate-900">{record.reportName}</TD>
                  <TD>
                    <Badge variant="info">{record.type}</Badge>
                  </TD>
                  <TD className="text-slate-600">{record.generatedDate}</TD>
                  <TD className="text-slate-600">{record.format}</TD>
                  <TD className="text-slate-600">{record.fileSize}</TD>
                  <TD>{getStatusBadge(record.status)}</TD>
                  <TD>
                    <button
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Download"
                      disabled={record.status !== 'Completed'}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </TD>
                </TR>
              ))}
              {paginatedHistory.length === 0 && (
                <TR>
                  <TD colSpan={7} className="text-center py-8 text-slate-400">
                    No report history available.
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalItems={reports.history.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            entityName="reports"
          />
        </Card>
      </div>
    </div>
  );
};

export default SupplierReports;
