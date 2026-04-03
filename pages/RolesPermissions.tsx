import React, { useState } from 'react';
import { 
  Shield, Plus, Edit, Trash2, Check, ChevronDown, ChevronUp, 
  Layout, BarChart2, ShoppingCart, Package, Tag, Layers, 
  Users, Settings, Gift, Percent, MessageSquare, Star, Info
} from 'lucide-react';
import { 
  Card, Button, Input, Badge, Modal,
  Section, Grid, Table, THead, TBody, TR, TH, TD, KpiCard, CardHeader
} from '../components/ui';
import { ROLES, MODULES } from '../data';
import { Role, Permission } from '../types';

const RolesPermissionsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: MODULES.map(m => ({
      module: m,
      view: false,
      create: false,
      edit: false,
      delete: false
    })) as Permission[]
  });

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setRoleForm({
        name: role.name,
        description: role.description,
        permissions: JSON.parse(JSON.stringify(role.permissions))
      });
    } else {
      setEditingRole(null);
      setRoleForm({
        name: '',
        description: '',
        permissions: MODULES.map(m => ({
          module: m,
          view: false,
          create: false,
          edit: false,
          delete: false
        }))
      });
    }
    setIsModalOpen(true);
  };

  const handlePermissionChange = (module: string, action: keyof Omit<Permission, 'module'>, value: boolean) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.map(p => 
        p.module === module ? { ...p, [action]: value } : p
      )
    }));
  };

  const handleModuleToggle = (module: string, value: boolean) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.map(p => 
        p.module === module ? { ...p, view: value, create: value, edit: value, delete: value } : p
      )
    }));
  };

  const handleSelectAll = (value: boolean) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.map(p => ({
        ...p, view: value, create: value, edit: value, delete: value
      }))
    }));
  };

  const handleSave = () => {
    console.log('Saving role:', roleForm);
    setIsModalOpen(false);
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Dashboard': return <Layout className="h-4 w-4" />;
      case 'Analytics': return <BarChart2 className="h-4 w-4" />;
      case 'Orders': return <ShoppingCart className="h-4 w-4" />;
      case 'Products': return <Package className="h-4 w-4" />;
      case 'Suppliers': return <Tag className="h-4 w-4" />;
      case 'Categories': return <Layers className="h-4 w-4" />;
      case 'Customers': return <Users className="h-4 w-4" />;
      case 'Coupons': return <Percent className="h-4 w-4" />;
      case 'Pricing Tiers': return <Tag className="h-4 w-4" />;
      case 'Marketing': return <MessageSquare className="h-4 w-4" />;
      case 'Loyalty Program': return <Gift className="h-4 w-4" />;
      case 'Users': return <Users className="h-4 w-4" />;
      case 'Administration': return <Settings className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      <Section 
        title="Roles & Permissions" 
        description="Define access levels and module permissions for your team."
        action={
          <Button 
            icon={<Plus className="h-4 w-4" />} 
            onClick={() => handleOpenModal()}
            className="shadow-lg shadow-indigo-100"
          >
            Create New Role
          </Button>
        }
      >
        <Grid cols={4} gap={4}>
          <KpiCard title="Total Roles" value={ROLES.length} icon={Shield} color="indigo" />
        </Grid>

        <Card padding="none" className="overflow-hidden border-slate-100 shadow-sm">
          <Table>
            <THead>
              <TR>
                <TH>Role Name</TH>
                <TH>Description</TH>
                <TH>Modules Accessible</TH>
                <TH align="center">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {ROLES.map((role) => (
                <TR key={role.id} className="hover:bg-slate-50/50 transition-colors">
                  <TD>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-bold text-slate-900">{role.name}</div>
                    </div>
                  </TD>
                  <TD>
                    <div className="text-sm text-slate-500 max-w-md line-clamp-1">{role.description}</div>
                  </TD>
                  <TD>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.filter(p => p.view).slice(0, 3).map(p => (
                        <Badge key={p.module} variant="info" className="text-[10px] py-0 px-1.5">{p.module}</Badge>
                      ))}
                      {role.permissions.filter(p => p.view).length > 3 && (
                        <Badge variant="neutral" className="text-[10px] py-0 px-1.5">+{role.permissions.filter(p => p.view).length - 3} more</Badge>
                      )}
                    </div>
                  </TD>
                  <TD align="center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => handleOpenModal(role)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Edit Role"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Role"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      </Section>

      {/* Create/Edit Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? "Edit Role Permissions" : "Create New System Role"}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={!roleForm.name}>
              {editingRole ? "Update Role" : "Create Role"}
            </Button>
          </div>
        }
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <Card className="border-slate-100">
            <CardHeader title="Role Information" icon={<Info className="h-4 w-4 text-slate-500" />} />
            <div className="p-5 space-y-4">
              <Input 
                label="Role Name" 
                placeholder="e.g. Inventory Manager" 
                value={roleForm.name}
                onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input 
                label="Description" 
                placeholder="Briefly describe what this role can do" 
                value={roleForm.description}
                onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </Card>

          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Module Permissions</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => handleSelectAll(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Select All
              </button>
              <button 
                onClick={() => handleSelectAll(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {roleForm.permissions.map((perm) => (
              <Card key={perm.module} className={`border-slate-100 transition-all ${perm.view ? 'bg-white' : 'bg-slate-50/50'}`}>
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${perm.view ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      {getModuleIcon(perm.module)}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${perm.view ? 'text-slate-900' : 'text-slate-500'}`}>{perm.module}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Module</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={perm.view}
                        onChange={(e) => handlePermissionChange(perm.module, 'view', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">View</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={perm.create}
                        onChange={(e) => handlePermissionChange(perm.module, 'create', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Create</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={perm.edit}
                        onChange={(e) => handlePermissionChange(perm.module, 'edit', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Edit</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={perm.delete}
                        onChange={(e) => handlePermissionChange(perm.module, 'delete', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Delete</span>
                    </label>
                    <div className="h-4 w-px bg-slate-200 hidden sm:block mx-2" />
                    <button 
                      onClick={() => handleModuleToggle(perm.module, !perm.view)}
                      className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest"
                    >
                      {perm.view && perm.create && perm.edit && perm.delete ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RolesPermissionsPage;
