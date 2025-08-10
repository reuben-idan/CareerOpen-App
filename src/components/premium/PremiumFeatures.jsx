import React from 'react';
import { 
  CheckCircleIcon, 
  StarIcon, 
  LightningBoltIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  DocumentSearchIcon,
  ClockIcon,
  CalendarIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  BellIcon,
  ChatAlt2Icon,
  TemplateIcon
} from '@heroicons/react/outline';

const PremiumFeatures = () => {
  const features = [
    {
      name: 'Advanced Applicant Tracking',
      description: 'Track candidates through every stage of the hiring process with our comprehensive ATS.',
      icon: DocumentSearchIcon,
      category: 'core',
    },
    {
      name: 'AI-Powered Job Matching',
      description: 'Get intelligent job recommendations based on your skills and preferences.',
      icon: StarIcon,
      category: 'ai',
    },
    {
      name: 'Priority Job Listings',
      description: 'Your job postings appear at the top of search results and are highlighted.',
      icon: LightningBoltIcon,
      category: 'visibility',
    },
    {
      name: 'Company Branding',
      description: 'Showcase your company with a branded profile and featured job listings.',
      icon: ShieldCheckIcon,
      category: 'branding',
    },
    {
      name: 'Advanced Analytics',
      description: 'Gain insights into your job postings with detailed performance metrics.',
      icon: ChartBarIcon,
      category: 'analytics',
    },
    {
      name: 'Team Collaboration',
      description: 'Invite team members to collaborate on hiring with role-based permissions.',
      icon: UserGroupIcon,
      category: 'collaboration',
    },
    {
      name: 'Custom Application Forms',
      description: 'Create tailored application forms to gather the exact information you need.',
      icon: TemplateIcon,
      category: 'customization',
    },
    {
      name: 'Interview Scheduling',
      description: 'Let candidates book interviews directly on your calendar.',
      icon: CalendarIcon,
      category: 'efficiency',
    },
    {
      name: 'Salary Benchmarking',
      description: 'See how your salaries compare to market rates for similar roles.',
      icon: CurrencyDollarIcon,
      category: 'insights',
    },
    {
      name: 'Multi-Posting',
      description: 'Post to multiple job boards with a single click.',
      icon: GlobeAltIcon,
      category: 'reach',
    },
    {
      name: 'Automated Screening',
      description: 'Automatically screen candidates based on your criteria.',
      icon: CheckCircleIcon,
      category: 'efficiency',
    },
    {
      name: 'Custom Notifications',
      description: 'Get alerts for important hiring activities and milestones.',
      icon: BellIcon,
      category: 'communication',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Features' },
    { id: 'core', name: 'Core Features' },
    { id: 'ai', name: 'AI & Matching' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'efficiency', name: 'Efficiency Tools' },
  ];

  const [activeCategory, setActiveCategory] = React.useState('all');

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === activeCategory);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'ai':
        return <LightningBoltIcon className="w-5 h-5" />;
      case 'analytics':
        return <ChartBarIcon className="w-5 h-5" />;
      case 'efficiency':
        return <ClockIcon className="w-5 h-5" />;
      case 'core':
      default:
        return <CheckCircleIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Premium Features for</span>
            <span className="block text-indigo-600 mt-2">Recruitment Success</span>
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Unlock powerful tools to find the best talent and streamline your hiring process.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center mb-12 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 transform -translate-y-0.5'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature) => (
            <div 
              key={feature.name}
              className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-indigo-100 overflow-hidden group"
            >
              {/* Glassmorphism effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/30 rounded-2xl -z-10" />
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {getCategoryIcon(feature.category)}
                    <span className="ml-1">
                      {categories.find(c => c.id === feature.category)?.name || 'Feature'}
                    </span>
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                
                <div className="mt-4 flex items-center text-sm text-indigo-600 font-medium">
                  Learn more
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Ready to transform your hiring process?
          </h3>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of companies that trust our platform to find their next great hire.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
            >
              Start 14-Day Free Trial
            </button>
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              Schedule a Demo
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatures;
