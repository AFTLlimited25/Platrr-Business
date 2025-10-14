import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';

const PricingPage: React.FC = () => {
  const features = [
    'Unlimited staff management',
    'Complete inventory control',
    'Advanced analytics & reporting',
    'Real-time notifications',
    'Mobile app access',
    'Customer support',
    'Data backup & security',
    'Multi-location support',
    'Custom integrations',
    'Training & onboarding'
  ];

  const faqs = [
    {
      question: 'What happens during the free trial?',
      answer: 'You get full access to all Platrr Business features for 30 days. No credit card required, no hidden fees.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.'
    },
    {
      question: 'Do you offer support?',
      answer: 'Yes, we provide dedicated customer support via email, chat, and phone during business hours.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade security measures and regular backups to keep your data safe.'
    },
    {
      question: 'Can I manage multiple locations?',
      answer: 'Yes, our Business Enterprise plan supports multiple restaurant locations with centralized management.'
    }
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with a 30-day free trial. No credit card required. 
            All features included from day one.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Business Enterprise</h3>
                <p className="text-orange-100">Perfect for restaurants of all sizes</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="px-8 py-6 text-center border-b border-gray-200">
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900">£9.99</span>
                <span className="text-xl text-gray-600 ml-2">/month</span>
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">
                30-Day Free Trial
              </div>
              <p className="text-gray-600">
                No setup fees, no contracts, cancel anytime
              </p>
            </div>

            {/* Features */}
            <div className="px-8 py-6">
              <h4 className="font-semibold text-gray-900 mb-4">Everything included:</h4>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="px-8 py-6 bg-gray-50">
              <Link
                to="/signup"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-sm text-gray-500 text-center mt-3">
                No credit card required
              </p>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Try Risk-Free</h3>
              <p className="text-gray-600">
                30-day free trial with full access to all features. No credit card required.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Features Included</h3>
              <p className="text-gray-600">
                No hidden fees or premium tiers. Get everything you need in one plan.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cancel Anytime</h3>
              <p className="text-gray-600">
                No long-term contracts. Cancel your subscription anytime with one click.
              </p>
            </div>
          </div>
        </div>

        {/* ROI Section */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              £9.99/month pays for itself
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Our customers typically see significant cost savings and efficiency improvements 
              within the first month of using Platrr Business.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-orange-500 mb-2">£500+</div>
                <div className="text-sm text-gray-600">Average monthly savings from reduced food waste</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-orange-500 mb-2">10+ hrs</div>
                <div className="text-sm text-gray-600">Time saved on admin tasks per week</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-orange-500 mb-2">25%</div>
                <div className="text-sm text-gray-600">Improvement in staff productivity</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to start your free trial?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of restaurant owners who trust Platrr Business
          </p>
          <Link
            to="/signup"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center space-x-2"
          >
            <span>Start 30-Day Free Trial</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;