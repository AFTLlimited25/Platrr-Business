<<<<<<< HEAD
// src/pages/staff/StaffManagement.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
=======
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Edit3 as EditIcon, Trash2, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

// -------------------- Types --------------------
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

// -------------------- Input Component --------------------
const Input = React.memo(function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />
    </div>
  );
});

// -------------------- Modal Wrapper --------------------
const Modal = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// -------------------- Main Component --------------------
const StaffManagement: React.FC = () => {
  const { currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    address: '',
  });
  const [editStaff, setEditStaff] = useState<Staff>({
    id: '',
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'active',
    address: '',
    joinDate: '',
  });

  const roles = ['Head Chef', 'Cook', 'Server', 'Manager', 'Cleaner'];

  // -------------------- Generate Unique Employee ID --------------------
  const generateUniqueEmployeeId = (): string => {
    const existing = new Set(staffList.map((s) => s.employeeId));
    for (let i = 0; i < 1000; i++) {
      const randomNum = Math.floor(Math.random() * 90000) + 10000;
      const id = `PLA${randomNum}`;
      if (!existing.has(id)) return id;
    }
    return `PLA${Date.now().toString().slice(-5)}`;
  };

  // -------------------- Firestore Listener --------------------
  useEffect(() => {
    if (!currentUser) {
      setStaffList([]);
      return;
    }
    const staffCol = collection(db, 'users', currentUser.uid, 'staff');
    const q = query(staffCol, orderBy('joinDate', 'asc'));
<<<<<<< HEAD
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
=======
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: Staff[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Staff),
        }));
        setStaffList(items);
      },
      (err) => {
        console.error('Failed to load staff', err);
        error('Failed to load staff', String(err?.message || err));
      }
    );
    return () => unsub();
  }, [currentUser]); // ✅ Removed 'error' dependency to prevent unnecessary re-renders
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255

  // -------------------- Debounced Search --------------------
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // -------------------- Filtered Staff --------------------
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const term = debouncedSearch.trim().toLowerCase();
      const matchesSearch =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.role.toLowerCase().includes(term);
      const matchesRole = selectedRole === 'all' || s.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [staffList, debouncedSearch, selectedRole]);

  // -------------------- Add Staff --------------------
  const handleAddStaff = useCallback(async () => {
    if (!newStaff.name || !newStaff.email || !newStaff.phone || !newStaff.role) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload: Omit<Staff, 'id'> = {
      employeeId: generateUniqueEmployeeId(),
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      role: newStaff.role,
      address: newStaff.address || '',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
    };
<<<<<<< HEAD
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
=======

    try {
      if (!currentUser) {
        setStaffList((prev) => [
          { id: (prev.length + 1).toString(), ...payload },
          ...prev,
        ]);
        success('Staff added (local)', `${payload.name} added`);
      } else {
        const colRef = collection(db, 'users', currentUser.uid, 'staff');
        await addDoc(colRef, { ...payload, createdAt: serverTimestamp() });
        success('Staff added', `${payload.name} added`);
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255
      }
    } catch (e: any) {
      error('Save failed', e.message || 'Failed to save to DB.');
    }

    setNewStaff({ name: '', email: '', phone: '', role: '', address: '' });
    setIsAddModalOpen(false);
  }, [newStaff, currentUser, staffList, error, success]);

  // -------------------- Edit Staff --------------------
  const handleStartEdit = (s: Staff) => {
    setEditStaff({ ...s });
    setIsEditModalOpen(true);
  };

<<<<<<< HEAD
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
=======
  const handleUpdateStaff = useCallback(async () => {
    if (
      !editStaff?.id ||
      !editStaff.name ||
      !editStaff.email ||
      !editStaff.phone ||
      !editStaff.role
    ) {
      error('Missing fields', 'Please fill in all required fields.');
      return;
    }

    try {
      if (!currentUser) {
        setStaffList((prev) =>
          prev.map((p) => (p.id === editStaff.id ? editStaff : p))
        );
        success('Staff updated (local)', `${editStaff.name} updated`);
      } else {
        const docRef = doc(db, 'users', currentUser.uid, 'staff', editStaff.id);
        await setDoc(docRef, editStaff);
        success('Staff updated', `${editStaff.name} updated`);
      }
      setIsEditModalOpen(false);
    } catch (e: any) {
      error('Update failed', e.message || 'Failed to update staff');
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255
    }
  }, [editStaff, currentUser, error, success]);

<<<<<<< HEAD
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
=======
  // -------------------- Delete Staff --------------------
  const requestDelete = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingId) return;
    const staff = staffList.find((s) => s.id === deletingId);
    try {
      if (!currentUser) {
        setStaffList((prev) => prev.filter((s) => s.id !== deletingId));
        success('Staff removed (local)', `${staff?.name} removed`);
      } else {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'staff', deletingId));
        success('Staff removed', `${staff?.name} removed`);
      }
    } catch (e: any) {
      error('Delete failed', e.message || 'Failed to delete staff');
    }
    setDeleteConfirmOpen(false);
    setDeletingId(null);
  }, [deletingId, staffList, currentUser, error, success]);
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255

  // -------------------- Status Colors --------------------
  const getStatusColor = (status: string) => {
    switch (status) {
<<<<<<< HEAD
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-break': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
=======
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on-break':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen text-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
<<<<<<< HEAD
          <p className="text-gray-600 mt-1">Manage your restaurant team and track attendance</p>
=======
          <p className="text-gray-600 mt-1">
            Manage your restaurant team and track attendance
          </p>
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="sm:w-48 w-full">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

<<<<<<< HEAD
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

=======
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {['Employee ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Actions'].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{s.employeeId}</td>
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">{s.phone}</td>
                <td className="px-4 py-2">{s.role}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded ${getStatusColor(s.status)}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleStartEdit(s)}>
                    <EditIcon className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                  </button>
                  <button onClick={() => requestDelete(s.id)}>
                    <Trash2 className="h-4 w-4 text-red-600 hover:text-red-800" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255

      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal title="Add Staff Member" onClose={() => setIsAddModalOpen(false)}>
          <div className="space-y-3">
            <Input
              label="Name"
              value={newStaff.name}
              onChange={(v) => setNewStaff({ ...newStaff, name: v })}
            />
            <Input
              label="Email"
              value={newStaff.email}
              onChange={(v) => setNewStaff({ ...newStaff, email: v })}
            />
            <Input
              label="Phone"
              value={newStaff.phone}
              onChange={(v) => setNewStaff({ ...newStaff, phone: v })}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                value={newStaff.role}
                onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <Input
              label="Address"
              value={newStaff.address}
              onChange={(v) => setNewStaff({ ...newStaff, address: v })}
            />
            <button
              onClick={handleAddStaff}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium mt-3"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal title="Edit Staff Member" onClose={() => setIsEditModalOpen(false)}>
          <div className="space-y-3">
            <Input
              label="Name"
              value={editStaff.name}
              onChange={(v) => setEditStaff({ ...editStaff, name: v })}
            />
            <Input
              label="Email"
              value={editStaff.email}
              onChange={(v) => setEditStaff({ ...editStaff, email: v })}
            />
            <Input
              label="Phone"
              value={editStaff.phone}
              onChange={(v) => setEditStaff({ ...editStaff, phone: v })}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                value={editStaff.role}
                onChange={(e) => setEditStaff({ ...editStaff, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <Input
              label="Address"
              value={editStaff.address}
              onChange={(v) => setEditStaff({ ...editStaff, address: v })}
            />
            <button
              onClick={handleUpdateStaff}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium mt-3"
            >
              Update
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmOpen && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirmOpen(false)}>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this staff member?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeleteConfirmOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StaffManagement;
