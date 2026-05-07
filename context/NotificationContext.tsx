import React, { createContext, useContext, useState, useCallback } from 'react';
import { CRMNotification, NotificationPriority, NotificationType, NotificationRole } from '../types';
import { NOTIFICATIONS } from '../data';

interface NotificationContextValue {
  notifications: CRMNotification[];
  markRead: (id: string) => void;
  markAllRead: (role: NotificationRole, repId?: string) => void;
  dismiss: (id: string) => void;
  getUnread: (role: NotificationRole, repId?: string) => CRMNotification[];
  getForRole: (role: NotificationRole, repId?: string) => CRMNotification[];
  getByPriority: (priority: NotificationPriority, role: NotificationRole, repId?: string) => CRMNotification[];
  getByType: (type: NotificationType) => CRMNotification[];
  unreadCount: (role: NotificationRole, repId?: string) => number;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<CRMNotification[]>(NOTIFICATIONS);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback((role: NotificationRole, repId?: string) => {
    setNotifications(prev => prev.map(n => {
      const roleMatch = n.visibleToRoles.includes(role) || n.visibleToRoles.includes('any');
      const repMatch = !repId || !n.repId || n.repId === repId;
      return roleMatch && repMatch ? { ...n, read: true } : n;
    }));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, dismissed: true, read: true } : n));
  }, []);

  const getForRole = useCallback((role: NotificationRole, repId?: string): CRMNotification[] => {
    return notifications.filter(n => {
      if (n.dismissed) return false;
      const roleMatch = n.visibleToRoles.includes(role) || n.visibleToRoles.includes('any');
      const repMatch = !repId || !n.repId || n.repId === repId;
      return roleMatch && repMatch;
    });
  }, [notifications]);

  const getUnread = useCallback((role: NotificationRole, repId?: string) =>
    getForRole(role, repId).filter(n => !n.read), [getForRole]);

  const getByPriority = useCallback((priority: NotificationPriority, role: NotificationRole, repId?: string) =>
    getForRole(role, repId).filter(n => n.priority === priority), [getForRole]);

  const getByType = useCallback((type: NotificationType) =>
    notifications.filter(n => n.type === type && !n.dismissed), [notifications]);

  const unreadCount = useCallback((role: NotificationRole, repId?: string) =>
    getUnread(role, repId).length, [getUnread]);

  return (
    <NotificationContext.Provider value={{
      notifications, markRead, markAllRead, dismiss,
      getUnread, getForRole, getByPriority, getByType, unreadCount,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
};
