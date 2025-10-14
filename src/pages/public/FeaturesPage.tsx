import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  BarChart3, 
  Clock, 
  Shield, 
  Smartphone,
  Calendar,
  AlertTriangle,
  DollarSign,
  FileText,
  Settings,
  Bell,
  ArrowRight
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const mainFeatures = [
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Complete employee management system with scheduling, attendance tracking, and performance monitoring.',
      features: [
        'Employee profiles and contact information',
        'Shift scheduling and time tracking',
        'Attendance monitoring',
        'Performance analytics',
        'Role-based permissions',
        'Payroll integration ready'
      ]
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Keep track of your inventory with real-time updates, low stock alerts, and supplier management.',
      features: [
        'Real-time stock level tracking',
        'Low stock alerts and notifications',
        'Supplier contact management',
        'Cost tracking and analysis',
        'Expiry date monitoring',
        'Waste reduction analytics'
      ]
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Comprehensive reporting system with insights into sales, staff performance, and operational efficiency.',
      features: [
        'Revenue and sales analytics',
        'Staff performance reports',
        'Inventory turnover analysis',
        'Cost breakdown reports',
        'Custom date range filtering',
        'Exportable data formats'
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get instant notifications about important events and changes in your restaurant.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with regular backups and 99.9% uptime guarantee.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Access all features from any device with our responsive web application.'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent shift scheduling with conflict detection and availability tracking.'
    },
    {
      icon: AlertTriangle,
      title: 'Smart Alerts',
      description: 'Automated notifications for low stock, staff absences, and critical issues.'
    },
    {
      icon: DollarSign,
      title: 'Cost Control',
      description: 'Monitor and control costs with detailed expense tracking and budget management.'
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Store and organize important documents, contracts, and compliance records.'
    },
    {
      icon: Settings,
      title: 'Customizable',
      description: 'Adapt the system to your needs with customizable settings and workflows.'
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Stay informed with customizable notifications via email and in-app alerts.'
    }
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Powerful features for
            <span className="text-orange-500 block">modern restaurants</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to run your restaurant efficiently, reduce costs, 
            and provide exceptional customer service.
          </p>
        </div>

        {/* Main Features */}
        <div className="space-y-24">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-row-dense' : ''}`}>
                <div className={!isEven ? 'lg:col-start-2' : ''}>
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-orange-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h2>
                  <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                  
                  <ul className="space-y-3">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8">
                    {/* Demo UI based on feature type */}
                    {index === 0 && ( // Staff Management
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                              JD
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">John Doe</h4>
                              <p className="text-sm text-gray-600">Head Chef</p>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <span className="text-green-600 font-medium">On Shift</span>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                              SA
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Sarah Adams</h4>
                              <p className="text-sm text-gray-600">Server</p>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <span className="text-orange-600 font-medium">Break</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {index === 1 && ( // Inventory Management
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">Tomatoes</span>
                            <span className="text-red-600 text-sm font-medium">Low Stock</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>3 kg remaining</span>
                            <span>Min: 20 kg</span>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">Chicken Breast</span>
                            <span className="text-green-600 text-sm font-medium">In Stock</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>40 kg remaining</span>
                            <span>Min: 10 kg</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {index === 2 && ( // Analytics & Reporting
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="font-medium text-gray-900 mb-2">Today's Sales</h4>
                          <div className="text-2xl font-bold text-gray-900 mb-1">£1,247</div>
                          <div className="text-sm text-green-600">+12% vs yesterday</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-lg font-bold text-gray-900">47</div>
                            <div className="text-xs text-gray-600">Orders</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="text-lg font-bold text-gray-900">£26.5</div>
                            <div className="text-xs text-gray-600">Avg Order</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Features Grid */}
        <section className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              And so much more
            </h2>
            <p className="text-xl text-gray-600">
              Additional features to help you run your restaurant like a pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Integration Section */}
        <section className="mt-24 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for modern restaurants
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Platrr Business is designed with modern restaurant operations in mind. 
              Our platform grows with your business and adapts to your unique needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">99.9%</div>
                <div className="text-sm text-gray-600">Uptime guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Customer support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">1000+</div>
                <div className="text-sm text-gray-600">Happy restaurants</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to revolutionize your restaurant?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your 30-day free trial today and see how Platrr Business 
            can transform your restaurant operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;