// src/pages/staff/StaffManagement.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, doc, addDoc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

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
  const { currentUser } = useAuth();

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Data state
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', role: '', address: '' });
  const [editStaff, setEditStaff] = useState<Staff>({
    id: '', employeeId: '', name: '', email: '', phone: '', role: '', status: 'active', address: '', joinDate: ''
  });

  const roles = ['Head Chef', 'Cook', 'Server', 'Manager', 'Cleaner'];

  // Generate unique employee ID
  const generateUniqueEmployeeId = (): string => {
    const existing = new Set(staffList.map(s => s.employeeId));
    for (let i = 0; i < 1000; i++) {
      const randomNum = Math.floor(Math.random() * 90000) + 10000;
      const id = `PLA${randomNum}`;
      if (!existing.has(id)) return id;
    }
    return `PLA${Date.now().toString().slice(-5)}`;
  };

  // Firestore subscription
  useEffect(() => {
    if (!currentUser) {
      setStaffList([]);
      return;
    }
    const staffCol = collection(db, 'users', currentUser.uid, 'staff');
    const q = query(staffCol, orderBy('joinDate', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const items: Staff[] = snap.docs.map(d => {
        const data = d.data() as Staff;
        return { ...data, id: d.id };
      });
      setStaffList(items);
    }, (err) => {
      console.error('Failed to load staff', err);
      toast.error(String(err?.message || err));
    });
    return () => unsub();
  }, [currentUser]);

  // Filtered staff
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term || s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term) || s.role.toLowerCase().includes(term);
      const matchesRole = selectedRole === 'all' || s.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [staffList, searchTerm, selectedRole]);

  // CRUD handlers
  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.email || !newStaff.phone || !newStaff.role) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const payload: Staff = {
      employeeId: generateUniqueEmployeeId(),
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      role: newStaff.role,
      address: newStaff.address || '',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      id: ''
    };
    if (!currentUser) {
      const temp: Staff = { ...payload, id: (staffList.length + 1).toString() };
      setStaffList(prev => [temp, ...prev]);
      toast.success(`${payload.name} added with Employee ID ${payload.employeeId}`);
    } else {
      try {
        const colRef = collection(db, 'users', currentUser.uid, 'staff');
        await addDoc(colRef, payload);
        toast.success(`${payload.name} added with Employee ID ${payload.employeeId}`);
      } catch (e: any) {
        console.error(e);
        toast.error(e.message || 'Failed to save to DB.');
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
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!currentUser) {
      setStaffList(prev => prev.map(p => p.id === editStaff.id ? editStaff : p));
      toast.success(`${editStaff.name} updated`);
      setIsEditModalOpen(false);
      return;
    }
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'staff', editStaff.id);
      await setDoc(docRef, editStaff);
      toast.success(`${editStaff.name} updated`);
      setIsEditModalOpen(false);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Failed to update staff');
    }
  };

  const requestDelete = async (id: string) => {
    const staff = staffList.find(s => s.id === id);
    if (!currentUser) {
      setStaffList(prev => prev.filter(s => s.id !== id));
      toast.success(`${staff?.name} removed`);
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'staff', id));
      toast.success(`${staff?.name} removed`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Failed to delete staff');
    }
  };

  // Utilities
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-break': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant team and track attendance</p>
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="sm:w-48 w-full">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Employee ID</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Name</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Email</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Phone</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Role</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Status</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredStaff.map(s => (
        <tr key={s.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
          <td className="px-4 py-2">{s.employeeId}</td>
          <td className="px-4 py-2">{s.name}</td>
          <td className="px-4 py-2">{s.email}</td>
          <td className="px-4 py-2">{s.phone}</td>
          <td className="px-4 py-2">{s.role}</td>
          <td className="px-4 py-2">
            <span className={`px-2 py-1 rounded ${getStatusColor(s.status)}`}>{s.status}</span>
          </td>
          <td className="px-4 py-2 flex gap-2">
            <button onClick={() => handleStartEdit(s)} className="text-orange-600 hover:text-orange-700"><Edit className="h-4 w-4" /></button>
            <button onClick={() => requestDelete(s.id)}><Trash2 className="h-4 w-4" /></button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold mb-4">Add Staff Member</h2>
            <input type="text" placeholder="Name" value={newStaff.name} onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))} className="w-full mb-3 px-3 py-2 border rounded" />
            <input type="email" placeholder="Email" value={newStaff.email} onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))} className="w-full mb-3 px-3 py-2 border rounded" />
            <input type="text" placeholder="Phone" value={newStaff.phone} onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))} className="w-full mb-3 px-3 py-2 border rounded" />
            <select value={newStaff.role} onChange={(e) => setNewStaff(prev => ({ ...prev, role: e.target.value }))} className="w-full mb-3 px-3 py-2 border rounded">
              <option value="">Select Role</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <textarea placeholder="Address" value={newStaff.address} onChange={(e) => setNewStaff(prev => ({ ...prev, address: e.target.value }))} className="w-full mb-3 px-3 py-2 border rounded" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleAddStaff} className="px-4 py-2 bg-orange-500 text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold mb-4">Edit Staff Member</h2>
            <p className="mb-2 text-sm text-gray-500">Employee ID: {editStaff.employeeId}</p>
            <input type="text" placeholder="Name" value={editStaff.name} onChange={(e) => setEditStaff(prev => ({ ...prev, name: e.target.value }))} className="w-full mb-3 px-3 py-2 border rounded" />
            <input type="email" placeholder="Email" value={editStaff.email} onChange={(e) => setEditStaff(prev => ({ ...prev, email: e.target.value }))} className="w-full mb-3 px-3 py-2 border rounded" />
            <input type="text" placeholder="Phone" value={editStaff.phone} onChange={(e) => setEditStaff(prev => ({ ...prev, phone: e.target.value }))} className="w-full mb-3 px-3 py-2 border rounded" />
            <select value={editStaff.role} onChange={(e) => setEditStaff(prev => ({ ...prev, role: e.target.value }))} className="w-full mb-3 px-3 py-2 border rounded">
              <option value="">Select Role</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <textarea placeholder="Address" value={editStaff.address} onChange={(e) => setEditStaff(prev => ({ ...prev, address: e.target.value }))} className="w-full mb-3 px-3 py-2 border rounded" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleUpdateStaff} className="px-4 py-2 bg-orange-500 text-white rounded">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
