// src/pages/staff/StaffManagement.tsx
import React, { useState, useEffect } from 'react';
import {
  Users, Plus, Search, CreditCard as EditIcon, Trash2, Phone, Mail, X, AlertTriangle
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import {
  collection, doc, addDoc, setDoc, deleteDoc, onSnapshot, query, orderBy
} from 'firebase/firestore';

interface Staff {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'on-break';
  joinDate: string;
  address: string;
  avatar?: string;
}

const StaffManagement: React.FC = () => {
  const { success, error } = useToast();
  const { currentUser } = useAuth();

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Data state
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [newStaff, setNewStaff] = useState({
    name: '', email: '', phone: '', role: '', address: ''
  });
  const [editStaff, setEditStaff] = useState<Partial<Staff>>({ id: '', employeeId: '', name: '', email: '', phone: '', role: '', status: 'active', address: '' });

  const roles = ['Head Chef', 'Cook', 'Server', 'Manager', 'Cleaner'];
  const statuses = ['active', 'inactive', 'on-break'];

  // Helper to generate unique PLA employee id (keeps local uniqueness; Firestore doc ids still used)
  const generateUniqueEmployeeId = (): string => {
    const existing = new Set(staffList.map(s => s.employeeId));
    for (let i = 0; i < 1000; i++) {
      const randomNum = Math.floor(Math.random() * 90000) + 10000;
      const id = `PLA${randomNum}`;
      if (!existing.has(id)) return id;
    }
    return `PLA${Date.now().toString().slice(-5)}`;
  };

  // Subscribe to staff collection
  useEffect(() => {
    if (!currentUser) {
      setStaffList([]);
      return;
    }
    const staffCol = collection(db, 'users', currentUser.uid, 'staff');
    const q = query(staffCol, orderBy('joinDate', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const items: Staff[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      setStaffList(items);
    }, (err) => {
      console.error('Failed to load staff', err);
      error('Failed to load staff', String(err?.message || err));
    });

    return () => unsub();
  }, [currentUser, error]);

  // Filtering
  const filteredStaff = staffList.filter(s => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term || s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term) || s.role.toLowerCase().includes(term);
    const matchesRole = selectedRole === 'all' || s.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // CRUD handlers
  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.email || !newStaff.phone || !newStaff.role) {
      error('Missing fields', 'Please fill in all required fields.');
      return;
    }
    const payload = {
      employeeId: generateUniqueEmployeeId(),
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      role: newStaff.role,
      address: newStaff.address || '',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    if (!currentUser) {
      // local fallback
      const temp: Staff = { id: (staffList.length + 1).toString(), ...payload } as Staff;
      setStaffList(prev => [temp, ...prev]);
      success('Staff added (local)', `${payload.name} added with ID ${payload.employeeId}`);
    } else {
      try {
        const colRef = collection(db, 'users', currentUser.uid, 'staff');
        await addDoc(colRef as any, payload as any);
        success('Staff added', `${payload.name} added with Employee ID ${payload.employeeId}`);
      } catch (e: any) {
        console.error(e);
        error('Save failed', e.message || 'Failed to save to DB.');
      }
    }
    setNewStaff({ name: '', email: '', phone: '', role: '', address: '' });
    setIsAddModalOpen(false);
  };

  const handleStartEdit = (s: Staff) => {
    setEditStaff({ ...s });
    setIsEditModalOpen(true);
  };

  const handleUpdateStaff = async () => {
    if (!editStaff?.id || !editStaff.name || !editStaff.email || !editStaff.phone || !editStaff.role) {
      error('Missing fields', 'Please fill in all required fields.');
      return;
    }
    if (!currentUser) {
      setStaffList(prev => prev.map(p => p.id === editStaff.id ? ({ ...p, ...editStaff } as Staff) : p));
      success('Staff updated (local)', `${editStaff.name} updated`);
      setIsEditModalOpen(false);
      return;
    }
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'staff', editStaff.id as string);
      await setDoc(docRef, { ...(editStaff as Staff) });
      success('Staff updated', `${editStaff.name} updated`);
      setIsEditModalOpen(false);
    } catch (e: any) {
      console.error(e);
      error('Update failed', e.message || 'Failed to update staff');
    }
  };

  const requestDelete = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    const staff = staffList.find(s => s.id === deletingId);
    if (!currentUser) {
      setStaffList(prev => prev.filter(s => s.id !== deletingId));
      success('Staff removed (local)', `${staff?.name} removed`);
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'staff', deletingId));
      success('Staff removed', `${staff?.name} removed`);
    } catch (e: any) {
      console.error(e);
      error('Delete failed', e.message || 'Failed to delete staff');
    }
    setDeleteConfirmOpen(false);
    setDeletingId(null);
  };

  // Utilities
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'on-break': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
  <div className="space-y-6 p-4 sm:p-6 lg:p-8">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Staff Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your restaurant team and track attendance
        </p>
      </div>
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Add Staff Member</span>
      </button>
    </div>

    {/* Filters */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div className="sm:w-48 w-full">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    {/* Staff Table */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
      {/* ...your table code as-is */}
    </div>

    {/* Modals remain unchanged */}
    {isAddModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
          {/* Add Modal content */}
        </div>
      </div>
    )}

    {isEditModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
          {/* Edit Modal content */}
        </div>
      </div>
    )}
  </div>
);
};

export default StaffManagement;

