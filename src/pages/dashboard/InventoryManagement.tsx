import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit as EditIcon, Trash2, TrendingDown, Calendar, DollarSign, X, ArrowUpDown } from 'lucide-react';
import { collection, doc, onSnapshot, addDoc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { useToast } from '../../contexts/ToastContext';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  expiryDate?: string;
  lastRestocked: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
}

const InventoryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: 'asc' | 'desc' } | null>(null);
  const { success, error } = useToast();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    name: '', category: '', currentStock: '', minStock: '', maxStock: '',
    unit: '', costPerUnit: '', supplier: '', expiryDate: ''
  });

  const categories = ['Vegetables', 'Meat', 'Seafood', 'Dairy', 'Condiments', 'Herbs', 'Dry Goods', 'Beverages'];
  const units = ['kg', 'g', 'L', 'ml', 'pieces', 'bottles', 'cans', 'bunches', 'boxes'];

  // Subscribe to auth changes and inventory
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        const invCol = collection(db, 'users', user.uid, 'inventory');
        const q = query(invCol, orderBy('lastRestocked', 'desc'));
        const unsubInv = onSnapshot(q, (snapshot) => {
          const items: InventoryItem[] = snapshot.docs.map(docSnap => {
            const data = docSnap.data() as any;
            return updateStatuses([{ id: docSnap.id, ...(data as Omit<InventoryItem, 'id'>) }])[0];
          });
          setInventory(items);
        }, (err) => {
          console.error('Inventory snapshot error', err);
          error('Failed to load inventory', err.message || String(err));
        });
        return () => unsubInv();
      } else {
        setUserId(null);
      }
    });
    return () => unsubAuth();
  }, []);

  // Status updater
  const updateStatuses = (items: InventoryItem[]): InventoryItem[] => {
    const today = '2025-10-04';
    return items.map(item => {
      let status: InventoryItem['status'] = 'in-stock';
      if (item.expiryDate && item.expiryDate < today) status = 'expired';
      else if (item.currentStock === 0) status = 'out-of-stock';
      else if (item.currentStock <= item.minStock) status = 'low-stock';
      return { ...item, status };
    });
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedInventory = [...filteredInventory];
  if (sortConfig) {
    const { key, direction } = sortConfig;
    sortedInventory.sort((a, b) => {
      const av = (a[key] as any);
      const bv = (b[key] as any);
      if (av < bv) return direction === 'asc' ? -1 : 1;
      if (av > bv) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const requestSort = (key: keyof InventoryItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.currentStock || !newItem.minStock) {
      error('Missing fields', 'Please fill in all required fields.');
      return;
    }
    if (!userId) {
      error('Not authenticated', 'You must be signed in to add inventory items.');
      return;
    }

    const currentStock = parseInt(newItem.currentStock);
    const minStock = parseInt(newItem.minStock);
    const itemData = {
      name: newItem.name,
      category: newItem.category,
      currentStock,
      minStock,
      maxStock: parseInt(newItem.maxStock) || minStock * 2,
      unit: newItem.unit,
      costPerUnit: parseFloat(newItem.costPerUnit) || 0,
      supplier: newItem.supplier,
      expiryDate: newItem.expiryDate || null,
      lastRestocked: new Date().toISOString().split('T')[0],
      status: 'in-stock'
    } as Omit<InventoryItem, 'id'>;

    (async () => {
      try {
        const colRef = collection(db, 'users', userId, 'inventory');
        await addDoc(colRef, itemData as any);
        setNewItem({ name: '', category: '', currentStock: '', minStock: '', maxStock: '', unit: '', costPerUnit: '', supplier: '', expiryDate: '' });
        setIsAddModalOpen(false);
        success('Item added!', `${itemData.name} has been added to inventory.`);
      } catch (err: any) {
        console.error('Failed to add item', err);
        error('Add failed', err.message || String(err));
      }
    })();
  };

  const handleEditItem = () => {
    if (!editingItem) return;
    if (!editingItem.name || !editingItem.category || editingItem.currentStock == null || editingItem.minStock == null) {
      error('Missing fields', 'Please fill in all required fields.');
      return;
    }
    if (!userId) {
      error('Not authenticated', 'You must be signed in to edit inventory items.');
      return;
    }

    const itemToSave = { ...editingItem } as InventoryItem;
    (async () => {
      try {
        const docRef = doc(db, 'users', userId, 'inventory', itemToSave.id);
        await setDoc(docRef, { ...itemToSave });
        setIsEditModalOpen(false);
        setEditingItem(null);
        success('Item updated!', `${itemToSave.name} has been updated.`);
      } catch (err: any) {
        console.error('Edit failed', err);
        error('Update failed', err.message || String(err));
      }
    })();
  };

  const handleDeleteItem = (id: string) => {
    if (!userId) {
      error('Not authenticated', 'You must be signed in to delete inventory items.');
      return;
    }

    const item = inventory.find(i => i.id === id);
    (async () => {
      try {
        const docRef = doc(db, 'users', userId, 'inventory', id);
        await deleteDoc(docRef);
        success('Item removed', `${item?.name} has been removed from inventory.`);
      } catch (err: any) {
        console.error('Delete failed', err);
        error('Delete failed', err.message || String(err));
      }
    })();
  };

  const handleStockChange = (id: string, change: number) => {
    if (!userId) {
      error('Not authenticated', 'You must be signed in to update stock.');
      return;
    }

    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const newStock = Math.max(0, item.currentStock + change);
    const updated = { ...item, currentStock: newStock, lastRestocked: change > 0 ? new Date().toISOString().split('T')[0] : item.lastRestocked };

    (async () => {
      try {
        const docRef = doc(db, 'users', userId, 'inventory', id);
        await setDoc(docRef, { ...updated });
        success('Stock updated', `${item?.name} stock adjusted.`);
      } catch (err: any) {
        console.error('Stock update failed', err);
        error('Stock update failed', err.message || String(err));
      }
    })();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'out-of-stock': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'expired': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStockPercentage = (current: number, max: number) => Math.min((current / max) * 100, 100);
  const getStockBarColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-500';
      case 'low-stock': return 'bg-yellow-500';
      case 'out-of-stock': return 'bg-red-500';
      case 'expired': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const lowStockCount = inventory.filter(item => item.status === 'low-stock').length;
  const outOfStockCount = inventory.filter(item => item.status === 'out-of-stock').length;
  const expiredCount = inventory.filter(item => item.status === 'expired').length;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track stock levels and manage suppliers</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <TrendingDown className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Low Stock Items</p>
            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{lowStockCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <TrendingDown className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-400">Out of Stock</p>
            <p className="text-2xl font-bold text-red-900 dark:text-red-300">{outOfStockCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <Calendar className="h-5 w-5 text-purple-600" />
          <div>
            <p className="text-sm font-medium text-purple-800 dark:text-purple-400">Expired Items</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{expiredCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search inventory..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white">
            <option value="all">All Categories</option>
            {categories.map(category => <option key={category} value={category}>{category}</option>)}
          </select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white">
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="min-w-[700px] w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => requestSort('name')}>Name <ArrowUpDown className="inline w-3 h-3" /></th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => requestSort('category')}>Category <ArrowUpDown className="inline w-3 h-3" /></th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => requestSort('currentStock')}>Stock <ArrowUpDown className="inline w-3 h-3" /></th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedInventory.map(item => (
              <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${getStockBarColor(item.status)}`} style={{ width: `${getStockPercentage(item.currentStock, item.maxStock)}%` }} />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.currentStock}/{item.maxStock} {item.unit}</span>
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <button onClick={() => { setEditingItem(item); setIsEditModalOpen(true); }} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteItem(item.id)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                  <button onClick={() => handleStockChange(item.id, 1)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs">+1</button>
                  <button onClick={() => handleStockChange(item.id, -1)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">-1</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modals */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Item</h2>
              <button onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {/* Input fields */}
              <input type="text" placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Current Stock" value={newItem.currentStock} onChange={e => setNewItem({ ...newItem, currentStock: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input type="number" placeholder="Min Stock" value={newItem.minStock} onChange={e => setNewItem({ ...newItem, minStock: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input type="number" placeholder="Max Stock" value={newItem.maxStock} onChange={e => setNewItem({ ...newItem, maxStock: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input type="text" placeholder="Unit" value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input type="number" placeholder="Cost per Unit" value={newItem.costPerUnit} onChange={e => setNewItem({ ...newItem, costPerUnit: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input type="text" placeholder="Supplier" value={newItem.supplier} onChange={e => setNewItem({ ...newItem, supplier: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input type="date" placeholder="Expiry Date" value={newItem.expiryDate} onChange={e => setNewItem({ ...newItem, expiryDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <button onClick={handleAddItem} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg">Add Item</button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Item</h2>
              <button onClick={() => setIsEditModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {/* Input fields */}
              <input type="text" placeholder="Item Name" value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <select value={editingItem.category} onChange={e => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Current Stock" value={editingItem.currentStock} onChange={e => setEditingItem({ ...editingItem, currentStock: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input type="number" placeholder="Min Stock" value={editingItem.minStock} onChange={e => setEditingItem({ ...editingItem, minStock: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input type="number" placeholder="Max Stock" value={editingItem.maxStock} onChange={e => setEditingItem({ ...editingItem, maxStock: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input type="text" placeholder="Unit" value={editingItem.unit} onChange={e => setEditingItem({ ...editingItem, unit: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input type="number" placeholder="Cost per Unit" value={editingItem.costPerUnit} onChange={e => setEditingItem({ ...editingItem, costPerUnit: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input type="text" placeholder="Supplier" value={editingItem.supplier} onChange={e => setEditingItem({ ...editingItem, supplier: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input type="date" placeholder="Expiry Date" value={editingItem.expiryDate || ''} onChange={e => setEditingItem({ ...editingItem, expiryDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <button onClick={handleEditItem} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InventoryManagement;
