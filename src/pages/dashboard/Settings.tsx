import React, { useState } from 'react';
import {
  User,
  Building,
  Bell,
  Shield,
  CreditCard,
  Eye,
  EyeOff,
  Save,
  LogOut,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Get trial days remaining
  const getTrialDaysRemaining = () => {
    if (!user?.trialEndsAt) return 30;
    const trialEnd = new Date(user.trialEndsAt);
    const today = new Date();
    const daysRemaining = Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysRemaining);
  };

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    businessName: user?.businessName || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    staffUpdates: true,
    orderNotifications: true,
    weeklyReports: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const handleSaveProfile = () => {
    toast.success('Profile updated');
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSaveNotifications = () => {
    toast.success('Notification settings updated');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', type: 'text' },
            { key: 'email', label: 'Email Address', type: 'email' },
            { key: 'phone', label: 'Phone Number', type: 'tel' },
            { key: 'businessName', label: 'Business Name', type: 'text' }
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                value={profileData[field.key as keyof typeof profileData]}
                onChange={(e) =>
                  setProfileData({ ...profileData, [field.key]: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSaveProfile}
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div>
                <label className="text-sm font-medium text-gray-900 block">
                  {key === 'emailNotifications'
                    ? 'Email Notifications'
                    : key === 'lowStockAlerts'
                    ? 'Low Stock Alerts'
                    : key === 'staffUpdates'
                    ? 'Staff Updates'
                    : key === 'orderNotifications'
                    ? 'Order Notifications'
                    : 'Weekly Reports'}
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {key === 'emailNotifications'
                    ? 'Receive email updates'
                    : key === 'lowStockAlerts'
                    ? 'Alert when stock is low'
                    : key === 'staffUpdates'
                    ? 'Staff schedule changes'
                    : key === 'orderNotifications'
                    ? 'New order notifications'
                    : 'Weekly business report'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  setNotifications({ ...notifications, [key]: e.target.checked })
                }
                className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSaveNotifications}
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          Save Preferences
        </button>
      </div>
    </div>
  );

  const trialDaysRemaining = getTrialDaysRemaining();
  const trialPercentage = (trialDaysRemaining / 30) * 100;

const renderBillingTab = () => (
  <div className="space-y-6">

    {/* Trial Status */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <CheckCircle className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-blue-900 mb-2">Free Trial Active</h4>
          <p className="text-sm text-blue-700 mb-4">
            You are currently on a 30-day free trial. Full access to all features with no credit card required.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                Days Remaining: {trialDaysRemaining}
              </span>
              <span className="text-sm text-blue-700">{Math.round(trialPercentage)}%</span>
            </div>

            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${trialPercentage}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* Upgrade Prompt */}
    {trialDaysRemaining <= 7 && (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-orange-900 mb-2">Trial Ending Soon</h4>
            <p className="text-sm text-orange-700 mb-4">
              Your free trial will end in {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''}. 
              Upgrade to continue using Platrr Business.
            </p>
            <button className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ONE PLAN ONLY */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h3>

      <div className="border-2 border-orange-500 rounded-xl p-6 bg-orange-50 shadow-sm">

        <h4 className="font-semibold text-gray-900 mb-2">Platrr Business – Premium</h4>

        <p className="text-3xl font-bold text-gray-900 mb-3">
          ₹499 <span className="text-sm text-gray-600">/month</span>
        </p>

        <p className="text-sm text-gray-600 mb-4">
          Full access to all features, unlimited staff, unlimited stores, and priority support.
        </p>

        <ul className="space-y-2 text-sm text-gray-700">
         <li>✓ Unlimited staff management</li>
<li>✓ Complete inventory control</li>
<li>✓ Advanced analytics & reporting</li>
<li>✓ Real-time notifications</li>
<li>✓ Mobile app access</li>
<li>✓ Customer support</li>
<li>✓ Data backup & security</li>
<li>✓ Multi-location support</li>
<li>✓ Custom integrations</li>
<li>✓ Training & onboarding</li>


        </ul>

        <button className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium w-full sm:w-auto">
          Subscribe Now
        </button>

      </div>
    </div>

  </div>
);


  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>
        </div>
        <button
          onClick={handleChangePassword}
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          Update Password
        </button>
      </div>

      {/* Logout */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session</h3>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 w-full sm:w-auto"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Tabs - Mobile: Dropdown, Desktop: Sidebar */}
          <div className="lg:col-span-1">
            {/* Mobile Dropdown */}
            <div className="lg:hidden mb-6">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-col space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            <div className="bg-white">
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'notifications' && renderNotificationsTab()}
              {activeTab === 'billing' && renderBillingTab()}
              {activeTab === 'security' && renderSecurityTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
