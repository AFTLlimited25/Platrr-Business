import React, { useState, useEffect } from 'react';
import {
  Users, Package, DollarSign, TrendingUp, AlertTriangle,
  CheckCircle, Calendar, ArrowUp, ArrowDown
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase';

const DashboardHome: React.FC = () => {
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [activeStaff, setActiveStaff] = useState<number>(0);
  const [ordersToday, setOrdersToday] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingShifts, setUpcomingShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const uid = user.uid;

      // Low Stock Count
      const invCol = collection(db, 'users', uid, 'inventory');
      onSnapshot(invCol, snapshot => {
        let count = 0;
        snapshot.forEach(doc => {
          const item = doc.data();
          if (item.currentStock > 0 && item.currentStock <= item.minStock) count++;
        });
        setLowStockCount(count);
      });

      // Total Revenue & Orders Today
      const ordersCol = collection(db, 'users', uid, 'orders');
      onSnapshot(ordersCol, snapshot => {
        let total = 0;
        let todayOrders = 0;
        const today = new Date().toISOString().slice(0, 10);
        snapshot.forEach(doc => {
          const order = doc.data();
          if (order.totalAmount) total += order.totalAmount;
          if (order.date?.slice(0, 10) === today) todayOrders++;
        });
        setTotalRevenue(total);
        setOrdersToday(todayOrders);
      });

      // Active Staff
      const staffCol = collection(db, 'users', uid, 'staff');
      onSnapshot(staffCol, snapshot => {
        const activeCount = snapshot.docs.filter(doc => {
          const data = doc.data();
          return data.isActive === true || data.status === 'active';
        }).length;
        setActiveStaff(activeCount);
      });

      // Recent Activity
      const activityCol = collection(db, 'users', uid, 'activity');
      const qAct = query(activityCol, orderBy('timestamp', 'desc'), limit(5));
      onSnapshot(qAct, snapshot => {
        const data = snapshot.docs.map(doc => doc.data());
        setRecentActivity(data);
      });

      // Upcoming Shifts
      const shiftCol = collection(db, 'users', uid, 'shifts');
      const qShift = query(shiftCol, orderBy('date', 'asc'), limit(3));
      onSnapshot(qShift, snapshot => {
        const data = snapshot.docs.map(doc => doc.data());
        setUpcomingShifts(data);
      });

      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

<<<<<<< HEAD
  if (loading) return (
    <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );
=======
  if (loading) return <p className="text-gray-600 text-center py-10">Loading dashboard...</p>;
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255

  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: 12.5, trend: 'up', icon: DollarSign,
      color: 'text-green-600', bgColor: 'bg-green-100'
    },
    {
      title: 'Active Staff',
      value: String(activeStaff),
      change: 2, trend: 'up', icon: Users,
      color: 'text-blue-600', bgColor: 'bg-blue-100'
    },
    {
      title: 'Low Stock Items',
      value: String(lowStockCount),
      change: -3, trend: 'down', icon: Package,
      color: 'text-orange-600', bgColor: 'bg-orange-100'
    },
    {
      title: 'Orders Today',
      value: String(ordersToday),
      change: 8.2, trend: 'up', icon: TrendingUp,
      color: 'text-purple-600', bgColor: 'bg-purple-100'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
<<<<<<< HEAD
      <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
=======
      <div className="sticky top-0 bg-white z-10 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255
          Overview of your restaurant and staff activities
        </p>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Metrics Grid - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
<<<<<<< HEAD
              <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
=======
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255
                  <div className={`${metric.bgColor} p-2 rounded-lg`}>
                    <Icon className={`${metric.color} h-5 w-5 sm:h-6 sm:w-6`} />
                  </div>
                  <div className={`flex items-center text-xs sm:text-sm font-medium ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.trend === 'up' ? <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />}
                    <span className="ml-1">{Math.abs(metric.change)}%</span>
                  </div>
                </div>
<<<<<<< HEAD
                <div>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{metric.title}</p>
=======
                <div className="mt-4">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-500">{metric.title}</p>
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity & Upcoming Shifts - Stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
<<<<<<< HEAD
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity: any, idx: number) => (
                  <div key={idx} className="px-4 sm:px-6 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 font-medium truncate">{activity.description || 'Activity logged'}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(activity.timestamp).toLocaleDateString()}</p>
=======
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">View all</button>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[350px]">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent activity</p>
              ) : (
                recentActivity.map((act, i) => {
                  const Icon =
                    act.type === 'inventory' ? Package :
                    act.type === 'staff' ? Users :
                    act.type === 'order' ? CheckCircle :
                    act.type === 'alert' ? AlertTriangle :
                    Clock;
                  return (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">
                        <Icon className="text-orange-600 h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{act.message || act.action || act.description || 'No details'}</p>
                        <p className="text-xs text-gray-500">
                          {act.timestamp ? new Date(act.timestamp.seconds ? act.timestamp.seconds * 1000 : act.timestamp).toLocaleString() : '—'}
                        </p>
                      </div>
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 sm:px-6 py-8 text-center">
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Shifts */}
<<<<<<< HEAD
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Upcoming Shifts</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingShifts.length > 0 ? (
                upcomingShifts.map((shift: any, idx: number) => (
                  <div key={idx} className="px-4 sm:px-6 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                    <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 font-medium truncate">{shift.staffName || 'Staff'}</p>
                      <p className="text-xs text-gray-500 mt-1">{shift.date} • {shift.time}</p>
                    </div>
=======
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Shifts</h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {upcomingShifts.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming shifts</p>
              ) : (
                upcomingShifts.map((shift, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{shift.staff}</p>
                    <p className="text-xs text-gray-500">{shift.role}</p>
                    <p className="mt-1 text-xs text-orange-600 font-semibold">{shift.time} - {shift.date}</p>
>>>>>>> 570bf96c769e66e1a7c8c5e5af55df0957dba255
                  </div>
                ))
              ) : (
                <div className="px-4 sm:px-6 py-8 text-center">
                  <p className="text-sm text-gray-500">No upcoming shifts</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {(lowStockCount > 0) && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-orange-900">Low Stock Alert</h3>
                <p className="text-sm text-orange-700 mt-1">
                  You have {lowStockCount} item{lowStockCount !== 1 ? 's' : ''} running low on stock. Please review your inventory.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
