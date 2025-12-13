import React, { useState } from 'react';
import { 
  CheckIcon, 
  StarIcon, 
  BriefcaseIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const PricingPlans = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [currentSlide, setCurrentSlide] = useState(0);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small teams',
      price: {
        monthly: 0,
        yearly: 0
      },
      billing: 'Free forever',
      features: [
        'Basic job postings',
        'Up to 5 applications per month',
        'Standard support',
        'Basic analytics',
        'Email notifications',
        '1 user account'
      ],
      featured: false,
      cta: 'Get Started',
      href: '/signup',
      popular: false
    },
    {
      name: 'Professional',
      description: 'For growing businesses',
      price: {
        monthly: 99,
        yearly: 89
      },
      billing: 'per month, billed annually',
      features: [
        'Unlimited job postings',
        'Up to 50 applications per month',
        'Priority support',
        'Advanced analytics',
        'Email & SMS notifications',
        'Up to 5 user accounts',
        'Company profile',
        'Custom application forms',
        'Basic ATS features'
      ],
      featured: true,
      cta: 'Start Free Trial',
      href: '/pricing/professional',
      popular: true
    },
    {
      name: 'Business',
      description: 'For established companies',
      price: {
        monthly: 249,
        yearly: 199
      },
      billing: 'per month, billed annually',
      features: [
        'Unlimited job postings',
        'Unlimited applications',
        '24/7 priority support',
        'Advanced analytics & reports',
        'Email, SMS & Slack notifications',
        'Up to 20 user accounts',
        'Advanced ATS',
        'Interview scheduling',
        'AI-powered candidate matching',
        'Custom workflows',
        'API access',
        'Dedicated account manager'
      ],
      featured: false,
      cta: 'Contact Sales',
      href: '/contact/sales',
      popular: false
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      price: 'Custom',
      billing: 'Tailored to your needs',
      features: [
        'Everything in Business, plus:',
        'Unlimited everything',
        'Dedicated infrastructure',
        'Single sign-on (SSO)',
        'Custom integrations',
        'Custom SLAs',
        'Onboarding & training',
        'Dedicated support team',
        'Custom development'
      ],
      featured: false,
      cta: 'Request Demo',
      href: '/demo/enterprise',
      popular: false
    }
  ];

  const features = [
    {
      name: 'Job Postings',
      tiers: {
        'Starter': '5 active',
        'Professional': 'Unlimited',
        'Business': 'Unlimited',
        'Enterprise': 'Unlimited',
      },
    },
    {
      name: 'Applications',
      tiers: {
        'Starter': 'Up to 5/month',
        'Professional': 'Up to 50/month',
        'Business': 'Unlimited',
        'Enterprise': 'Unlimited',
      },
    },
    {
      name: 'Users',
      tiers: {
        'Starter': '1',
        'Professional': 'Up to 5',
        'Business': 'Up to 20',
        'Enterprise': 'Unlimited',
      },
    },
    {
      name: 'Support',
      tiers: {
        'Starter': 'Standard',
        'Professional': 'Priority',
        'Business': '24/7 Priority',
        'Enterprise': 'Dedicated',
      },
    },
    {
      name: 'Analytics',
      tiers: {
        'Starter': 'Basic',
        'Professional': 'Advanced',
        'Business': 'Advanced + Reports',
        'Enterprise': 'Custom',
      },
    },
  ];

  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === plans.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? plans.length - 1 : prev - 1));
  };

  const getPrice = (plan) => {
    if (plan.price === 'Custom') return 'Custom';
    return `$${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}`;
  };

  const getBillingText = (plan) => {
    if (plan.name === 'Enterprise') return plan.billing;
    return billingCycle === 'yearly' ? 'per month, billed annually' : 'per month';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Simple, transparent pricing</span>
            <span className="block text-indigo-600 mt-2">For teams of all sizes</span>
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Choose the perfect plan for your hiring needs. No hidden fees, cancel anytime.
          </p>
          
          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">Monthly</span>
            <button
              type="button"
              className={`mx-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
              onClick={toggleBillingCycle}
              aria-pressed={billingCycle === 'yearly'}
            >
              <span className="sr-only">Toggle billing cycle</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Yearly</span>
              <span className="ml-2 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800">
                Save 15%
              </span>
            </div>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="lg:hidden relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {plans.map((plan, index) => (
                <div key={plan.name} className="w-full flex-shrink-0 px-2">
                  <PlanCard 
                    plan={plan} 
                    billingCycle={billingCycle} 
                    getPrice={getPrice} 
                    getBillingText={getBillingText}
                    isActive={currentSlide === index}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 p-2 rounded-full bg-white shadow-md text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 z-10"
            aria-label="Previous plan"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 p-2 rounded-full bg-white shadow-md text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 z-10"
            aria-label="Next plan"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
          
          <div className="flex justify-center mt-6 space-x-2">
            {plans.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full ${
                  currentSlide === index ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop comparison table */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {plans.map((plan) => (
              <PlanCard 
                key={plan.name} 
                plan={plan} 
                billingCycle={billingCycle} 
                getPrice={getPrice} 
                getBillingText={getBillingText}
                isActive={false}
              />
            ))}
          </div>
          
          {/* Feature comparison table */}
          <div className="mt-16">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Feature comparison</h3>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Features
                    </th>
                    {plans.map((plan) => (
                      <th key={plan.name} scope="col" className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white/30 divide-y divide-gray-200">
                  {features.map((feature) => (
                    <tr key={feature.name} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {feature.name}
                      </td>
                      {plans.map((plan) => (
                        <td key={`${feature.name}-${plan.name}`} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                          {feature.tiers[plan.name]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-white">Need help choosing the right plan?</h3>
            <p className="mt-2 text-lg text-indigo-100 max-w-2xl mx-auto">
              Our team is here to help you find the perfect solution for your hiring needs.
            </p>
            <div className="mt-6">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:scale-105"
              >
                Contact Sales
                <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanCard = ({ plan, billingCycle, getPrice, getBillingText, isActive }) => {
  const price = getPrice(plan);
  const billingText = getBillingText(plan);
  
  return (
    <div 
      className={`relative flex flex-col p-6 rounded-2xl border ${
        plan.popular 
          ? 'border-indigo-500 shadow-lg shadow-indigo-100 transform -translate-y-1' 
          : 'border-gray-200 bg-white/70 backdrop-blur-sm'
      } ${isActive ? 'ring-2 ring-indigo-500' : ''}`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute top-0 right-0 -mt-3 -mr-3">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
          {plan.popular && (
            <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          )}
        </div>
        
        <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
        
        <div className="mt-4">
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold text-gray-900">
              {price === 'Custom' ? 'Custom' : price}
            </span>
            {price !== 'Custom' && (
              <span className="ml-1 text-lg font-medium text-gray-500">/mo</span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">{billingText}</p>
        </div>
        
        <ul className="mt-6 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex">
              <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" aria-hidden="true" />
              <span className="ml-3 text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-8">
        <a
          href={plan.href}
          className={`block w-full py-3 px-6 text-center rounded-md border border-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
            plan.popular 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
          }`}
        >
          {plan.cta}
        </a>
      </div>
    </div>
  );
};

export default PricingPlans;
