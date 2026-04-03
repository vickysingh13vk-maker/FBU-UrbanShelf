import React, { useState, useMemo } from 'react';
import { 
  Users as UsersIcon, Plus, Search, Edit, Trash2, Shield, 
  CheckCircle, XCircle, MoreVertical, Mail, Calendar, UserPlus
} from 'lucide-react';
import { 
  Card, Button, Input, Select, Badge, Modal,
  Section, Grid, Table, THead, TBody, TR, TH, TD, KpiCard, CardHeader
} from '../components/ui';
import { USERS, ROLES } from '../data';
import { User } from '../types';

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  // --- Data Processing ---
  const filteredUsers = useMemo(() => {
    return USERS.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.roleId === roleFilter;
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, roleFilter, statusFilter]);

  const stats = {
    total: USERS.length,
    active: USERS.filter(u => u.status === 'Active').length,
    inactive: USERS.filter(u => u.status !== 'Active').length
  };

  // --- Handlers ---
  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        password: '',
        confirmPassword: '',
        roleId: user.roleId,
        status: user.status === 'Active' ? 'Active' : 'Inactive'
      });
    } else {
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleId: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    console.log('Saving user:', userForm);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      <Section 
        title="User Management" 
        description="Manage system users, roles, and account statuses."
        action={
          <Button 
            icon={<UserPlus className="h-4 w-4" />} 
            onClick={() => handleOpenModal()}
            className="shadow-lg shadow-indigo-100"
          >
            Add New User
          </Button>
        }
      >
        {/* Stats Section */}
        <Grid cols={3} gap={4}>
          <KpiCard title="Total Users" value={stats.total} icon={UsersIcon} color="indigo" />
          <KpiCard title="Active Users" value={stats.active} icon={CheckCircle} color="emerald" />
          <KpiCard title="Inactive Users" value={stats.inactive} icon={XCircle} color="neutral" />
        </Grid>

        {/* Filters & Table */}
        <Card padding="none" className="overflow-hidden border-slate-100 shadow-sm">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">
              <div className="w-full sm:w-80">
                <Input 
                  placeholder="Search by name or email..." 
                  icon={<Search className="h-4 w-4" />} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-slate-50/50 border-slate-200"
                >
                  <option value="All">All Roles</option>
                  {ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </Select>
              </div>
              <div className="w-full sm:w-48">
                <Select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50/50 border-slate-200"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </Select>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setRoleFilter('All'); setStatusFilter('All'); }}>Reset</Button>
          </div>

          <Table>
            <THead>
              <TR>
                <TH>User Details</TH>
                <TH>Role</TH>
                <TH>Status</TH>
                <TH>Created Date</TH>
                <TH align="center">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filteredUsers.map((user) => (
                <TR key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <TD>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{user.roleName}</span>
                    </div>
                  </TD>
                  <TD>
                    <Badge variant={user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'danger' : 'neutral'}>
                      {user.status}
                    </Badge>
                  </TD>
                  <TD>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {user.createdDate}
                    </div>
                  </TD>
                  <TD align="center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => handleOpenModal(user)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Deactivate User"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TD>
                </TR>
              ))}
              {filteredUsers.length === 0 && (
                <TR>
                  <TD colSpan={5} className="py-12 text-center text-slate-500">No users found matching your criteria</TD>
                </TR>
              )}
            </TBody>
          </Table>
        </Card>
      </Section>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User Account" : "Create New User Account"}
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={!userForm.name || !userForm.email || !userForm.roleId}>
              {editingUser ? "Save Changes" : "Create User"}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <Card className="border-slate-100">
            <CardHeader title="Account Details" icon={<UsersIcon className="h-4 w-4 text-slate-500" />} />
            <div className="p-5 space-y-4">
              <Input 
                label="Full Name" 
                placeholder="Enter full name" 
                value={userForm.name}
                onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input 
                label="Email Address" 
                type="email"
                placeholder="email@example.com" 
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Password" 
                  type="password"
                  placeholder="••••••••" 
                  value={userForm.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                />
                <Input 
                  label="Confirm Password" 
                  type="password"
                  placeholder="••••••••" 
                  value={userForm.confirmPassword}
                  onChange={(e) => setUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
            </div>
          </Card>

          <Card className="border-slate-100">
            <CardHeader title="Access & Status" icon={<Shield className="h-4 w-4 text-slate-500" />} />
            <div className="p-5 space-y-4">
              <Select 
                label="Assigned Role" 
                value={userForm.roleId}
                onChange={(e) => setUserForm(prev => ({ ...prev, roleId: e.target.value }))}
                required
              >
                <option value="">Select a role</option>
                {ROLES.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </Select>
              <Select 
                label="Account Status" 
                value={userForm.status}
                onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value as any }))}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
