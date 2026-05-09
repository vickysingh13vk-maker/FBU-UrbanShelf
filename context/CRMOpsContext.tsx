import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Escalation, EscalationStatus, ApprovalRequest, ApprovalStatus,
  AuditLog, AuditAction, CustomerDocument, CRMRecommendation,
} from '../types';
import {
  ESCALATIONS, APPROVAL_REQUESTS, AUDIT_LOGS,
  CUSTOMER_DOCUMENTS, CRM_RECOMMENDATIONS,
} from '../data';

interface CRMOpsContextValue {
  // Escalations
  escalations: Escalation[];
  createEscalation: (esc: Omit<Escalation, 'id' | 'status' | 'timeline' | 'createdAt' | 'updatedAt'>) => string;
  updateEscalationStatus: (id: string, status: EscalationStatus, note: string, by: string) => void;
  assignEscalation: (id: string, assignedTo: string, assignedToName: string) => void;
  getOpenEscalations: () => Escalation[];
  getEscalationsByCustomer: (customerId: string) => Escalation[];
  getEscalationsByRep: (repId: string) => Escalation[];
  getCriticalEscalations: () => Escalation[];
  // Approvals
  approvals: ApprovalRequest[];
  createApproval: (req: Omit<ApprovalRequest, 'id' | 'status' | 'requestedAt'>) => string;
  reviewApproval: (id: string, decision: ApprovalStatus, note: string, reviewerId: string, reviewerName: string) => void;
  getPendingApprovals: () => ApprovalRequest[];
  getApprovalsByRep: (repId: string) => ApprovalRequest[];
  // Audit
  auditLogs: AuditLog[];
  logAudit: (entry: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getAuditForEntity: (entityType: string, entityId: string) => AuditLog[];
  getAuditByUser: (userId: string) => AuditLog[];
  getRecentAudit: (limit?: number) => AuditLog[];
  // Documents
  documents: CustomerDocument[];
  getDocumentsForEntity: (entityType: CustomerDocument['linkedEntityType'], entityId: string) => CustomerDocument[];
  // Recommendations
  recommendations: CRMRecommendation[];
  dismissRecommendation: (id: string) => void;
  getActiveRecommendations: () => CRMRecommendation[];
}

const CRMOpsContext = createContext<CRMOpsContextValue | null>(null);

let escSeq = 6;
let appSeq = 7;
let audSeq = 13;

export const CRMOpsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [escalations, setEscalations] = useState<Escalation[]>(ESCALATIONS);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(APPROVAL_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(AUDIT_LOGS);
  const [documents] = useState<CustomerDocument[]>(CUSTOMER_DOCUMENTS);
  const [recommendations, setRecommendations] = useState<CRMRecommendation[]>(CRM_RECOMMENDATIONS);

  // ── Escalations ──────────────────────────────────────────────────────────
  const createEscalation = useCallback((esc: Omit<Escalation, 'id' | 'status' | 'timeline' | 'createdAt' | 'updatedAt'>) => {
    const id = `ESC${String(escSeq++).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newEsc: Escalation = {
      ...esc,
      id,
      status: 'Created',
      timeline: [{ status: 'Created', note: esc.description, by: esc.createdByName, at: now }],
      createdAt: now,
      updatedAt: now,
    };
    setEscalations(prev => [newEsc, ...prev]);
    return id;
  }, []);

  const updateEscalationStatus = useCallback((id: string, status: EscalationStatus, note: string, by: string) => {
    const now = new Date().toISOString();
    setEscalations(prev => prev.map(e => {
      if (e.id !== id) return e;
      return {
        ...e,
        status,
        timeline: [...e.timeline, { status, note, by, at: now }],
        updatedAt: now,
        resolvedAt: status === 'Resolved' ? now : e.resolvedAt,
      };
    }));
  }, []);

  const assignEscalation = useCallback((id: string, assignedTo: string, assignedToName: string) => {
    setEscalations(prev => prev.map(e =>
      e.id === id ? { ...e, assignedTo, assignedToName, status: 'Assigned', updatedAt: new Date().toISOString() } : e
    ));
  }, []);

  const getOpenEscalations = useCallback(() =>
    escalations.filter(e => e.status !== 'Closed' && e.status !== 'Resolved'), [escalations]);

  const getEscalationsByCustomer = useCallback((customerId: string) =>
    escalations.filter(e => e.customerId === customerId), [escalations]);

  const getEscalationsByRep = useCallback((repId: string) =>
    escalations.filter(e => e.repId === repId), [escalations]);

  const getCriticalEscalations = useCallback(() =>
    escalations.filter(e => e.priority === 'Critical' && e.status !== 'Closed'), [escalations]);

  // ── Approvals ─────────────────────────────────────────────────────────────
  const createApproval = useCallback((req: Omit<ApprovalRequest, 'id' | 'status' | 'requestedAt'>) => {
    const id = `AP${String(appSeq++).padStart(3, '0')}`;
    const newReq: ApprovalRequest = { ...req, id, status: 'Pending', requestedAt: new Date().toISOString() };
    setApprovals(prev => [newReq, ...prev]);
    return id;
  }, []);

  const reviewApproval = useCallback((id: string, decision: ApprovalStatus, note: string, reviewerId: string, reviewerName: string) => {
    setApprovals(prev => prev.map(a =>
      a.id === id
        ? { ...a, status: decision, reviewedBy: reviewerId, reviewedByName: reviewerName, reviewedAt: new Date().toISOString(), reviewNote: note }
        : a
    ));
  }, []);

  const getPendingApprovals = useCallback(() =>
    approvals.filter(a => a.status === 'Pending'), [approvals]);

  const getApprovalsByRep = useCallback((repId: string) =>
    approvals.filter(a => a.requestedBy === repId), [approvals]);

  // ── Audit ─────────────────────────────────────────────────────────────────
  const logAudit = useCallback((entry: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const log: AuditLog = {
      ...entry,
      id: `AUD${String(audSeq++).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
  }, []);

  const getAuditForEntity = useCallback((entityType: string, entityId: string) =>
    auditLogs.filter(a => a.entityType === entityType && a.entityId === entityId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp)), [auditLogs]);

  const getAuditByUser = useCallback((userId: string) =>
    auditLogs.filter(a => a.performedBy === userId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp)), [auditLogs]);

  const getRecentAudit = useCallback((limit = 20) =>
    [...auditLogs].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit), [auditLogs]);

  // ── Documents ─────────────────────────────────────────────────────────────
  const getDocumentsForEntity = useCallback((entityType: CustomerDocument['linkedEntityType'], entityId: string) =>
    documents.filter(d => d.linkedEntityType === entityType && d.linkedEntityId === entityId), [documents]);

  // ── Recommendations ───────────────────────────────────────────────────────
  const dismissRecommendation = useCallback((id: string) => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, dismissed: true } : r));
  }, []);

  const getActiveRecommendations = useCallback(() =>
    recommendations.filter(r => !r.dismissed), [recommendations]);

  return (
    <CRMOpsContext.Provider value={{
      escalations, createEscalation, updateEscalationStatus, assignEscalation,
      getOpenEscalations, getEscalationsByCustomer, getEscalationsByRep, getCriticalEscalations,
      approvals, createApproval, reviewApproval, getPendingApprovals, getApprovalsByRep,
      auditLogs, logAudit, getAuditForEntity, getAuditByUser, getRecentAudit,
      documents, getDocumentsForEntity,
      recommendations, dismissRecommendation, getActiveRecommendations,
    }}>
      {children}
    </CRMOpsContext.Provider>
  );
};

export const useCRMOps = () => {
  const ctx = useContext(CRMOpsContext);
  if (!ctx) throw new Error('useCRMOps must be used inside CRMOpsProvider');
  return ctx;
};
