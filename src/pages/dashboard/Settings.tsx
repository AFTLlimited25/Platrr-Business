import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Building, 
  Bell, 
  Shield, 
  CreditCard,
  Download,
  Upload,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+44 7700 900123',
    address: '123 Main Street, London, UK'
  });

  const [businessData, setBusinessData] = useState({
    businessName: user?.businessName || '',
    businessType: 'Restaurant',
    address: '456 Business Ave, London, UK',
    phone: '+44 20 7946 0958',
    website: 'www.bellavista.co.uk',
    taxNumber: 'GB123456789'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    lowStockAlerts: true,
    staffUpdates: true,
    orderNotifications: true,
    weeklyReports: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'business', label: 'Business', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  // Handlers
  const handleSaveProfile = () => success('Profile updated!', 'Your profile information has been saved successfully.');
  const handleSaveBusiness = () => success('Business settings updated!', 'Your business information has been saved successfully.');
  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('Password mismatch', 'New password and confirmation do not match.');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      error('Password too short', 'Password must be at least 8 characters long.');
      return;
    }
    success('Password changed!', 'Your password has been updated successfully.');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };
  const handleSaveNotifications = () => success('Notification preferences saved!', 'Your notification settings have been updated.');

  // Render functions
  const renderProfileTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['name', 'email', 'phone', 'address'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field === 'name' ? 'Full Name' : field === 'email' ? 'Email Address' : field === 'phone' ? 'Phone Number' : 'Address'}
            </label>
            <input
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              value={profileData[field as keyof typeof profileData]}
              onChange={(e) => setProfileData({ ...profileData, [field]: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
            />
          </div>
        ))}
      </div>
      <button onClick={handleSaveProfile} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
        <Save className="h-4 w-4" />
        <span>Save Changes</span>
      </button>
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'businessName', label: 'Business Name', type: 'text' },
          { key: 'businessType', label: 'Business Type', type: 'select', options: ['Restaurant','Cafe','Fast Food','Bar','Catering'] },
          { key: 'address', label: 'Business Address', type: 'text', span: 2 },
          { key: 'phone', label: 'Business Phone', type: 'tel' },
          { key: 'website', label: 'Website', type: 'url' },
          { key: 'taxNumber', label: 'Tax Number', type: 'text' },
        ].map((item) => (
          <div key={item.key} className={item.span === 2 ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{item.label}</label>
            {item.type === 'select' ? (
              <select
                value={businessData[item.key as keyof typeof businessData]}
                onChange={(e) => setBusinessData({ ...businessData, [item.key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
              >
                {item.options!.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input
                type={item.type}
                value={businessData[item.key as keyof typeof businessData]}
                onChange={(e) => setBusinessData({ ...businessData, [item.key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
              />
            )}
          </div>
        ))}
      </div>
      <button onClick={handleSaveBusiness} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
        <Save className="h-4 w-4" />
        <span>Save Changes</span>
      </button>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
              <p className="text-sm text-gray-500">
                {key === 'emailNotifications' && 'Receive notifications via email'}
                {key === 'pushNotifications' && 'Receive push notifications in browser'}
                {key === 'lowStockAlerts' && 'Get notified when inventory is running low'}
                {key === 'staffUpdates' && 'Receive updates about staff activities'}
                {key === 'orderNotifications' && 'Get notified about new orders'}
                {key === 'weeklyReports' && 'Receive weekly performance reports'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={value} onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:bg-orange-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        ))}
      </div>
      <button onClick={handleSaveNotifications} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
        <Save className="h-4 w-4" />
        <span>Save Preferences</span>
      </button>
    </div>
  );

  // Security & Billing tabs would follow similar light-mode styling (remove dark classes)

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and restaurant preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'business' && renderBusinessTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {/* Security & Billing tabs would go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
