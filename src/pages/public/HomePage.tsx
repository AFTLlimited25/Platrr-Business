import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  BarChart3, 
  Clock, 
  Shield, 
  Smartphone,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Manage your team, track attendance, and monitor performance with ease.'
    },
    {
      icon: Package,
      title: 'Inventory Control',
      description: 'Keep track of stock levels, manage suppliers, and reduce waste.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Get insights into your business performance with detailed reports.'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Stay updated with real-time notifications and status changes.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security measures.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Access your restaurant management tools from any device, anywhere.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Restaurant Owner',
      business: 'The Golden Spoon',
      content: 'Platrr Business has revolutionized how we manage our restaurant. The staff management features alone have saved us hours every week.',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Manager',
      business: 'Urban Bistro',
      content: 'The inventory management is incredible. We have reduced food waste by 30% since implementing Platrr Business.',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'Operations Director',
      business: 'Bella Vista Chain',
      content: 'Managing multiple locations has never been easier. The reporting features give us insights we never had before.',
      rating: 5
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-orange-100 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Streamline Your
              <span className="text-orange-500 block">Restaurant Operations</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              The complete restaurant management solution. Manage staff, track inventory, 
              analyze performance, and grow your business with Platrr Business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center space-x-2"
              >
                <span>Start 30-Day Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/features"
                className="text-orange-600 hover:text-orange-700 font-semibold text-lg inline-flex items-center space-x-2"
              >
                <span>Learn More</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Full access to all features
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to run your restaurant
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From staff management to inventory control, Platrr Business provides all the tools 
              you need to operate efficiently and grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
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
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Reduce costs, increase efficiency
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our restaurant management platform helps you optimize operations, 
                reduce waste, and improve profitability through smart automation and insights.
              </p>
              
              <div className="space-y-4">
                {[
                  'Reduce food waste by up to 30%',
                  'Improve staff productivity by 25%',
                  'Save 10+ hours per week on admin tasks',
                  'Increase customer satisfaction scores'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/pricing"
                className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium mt-8 transition-colors"
              >
                <span>View Pricing</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl">
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Monthly Revenue</span>
                    <span className="text-sm text-green-600">+15%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">£45,230</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Staff Efficiency</span>
                    <span className="text-sm text-green-600">+25%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">92%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Food Waste Reduction</span>
                    <span className="text-sm text-green-600">-30%</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">8.2%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by restaurant owners worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about Platrr Business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to transform your restaurant?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of restaurant owners who have streamlined their operations with Platrr Business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/features"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              View Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;