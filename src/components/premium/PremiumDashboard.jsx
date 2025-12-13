import React, { useState } from 'react';
import { 
  BriefcaseIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  EnvelopeIcon, 
  EyeIcon, 
  HeartIcon, 
  LinkIcon, 
  ShareIcon, 
  StarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const stats = [
  { name: 'Total Applications', value: '24', icon: DocumentTextIcon, change: '+12%', changeType: 'positive' },
  { name: 'Interview Rate', value: '42%', icon: CheckCircleIcon, change: '+8%', changeType: 'positive' },
  { name: 'Avg. Response Time', value: '2.4', unit: 'days', icon: ClockIcon, change: '-0.5', changeType: 'negative' },
  { name: 'Profile Views', value: '1,243', icon: EyeIcon, change: '+23%', changeType: 'positive' },
];

const recentActivity = [
  {
    id: 1,
    type: 'application',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    status: 'Application viewed',
    time: '2 hours ago',
    icon: BriefcaseIcon,
    iconBackground: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 2,
    type: 'message',
    title: 'New message from',
    company: 'Jane Cooper',
    status: 'Recruiter at DesignHub',
    time: '5 hours ago',
    icon: EnvelopeIcon,
    iconBackground: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    id: 3,
    type: 'saved',
    title: 'Job saved',
    company: 'Product Designer',
    status: 'Creative Labs',
    time: '1 day ago',
    icon: HeartIcon,
    iconBackground: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
  {
    id: 4,
    type: 'recommendation',
    title: 'New job matches',
    company: '3 new positions',
    status: 'Based on your profile',
    time: '2 days ago',
    icon: StarIcon,
    iconBackground: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
];

const jobMatches = [
  {
    id: 1,
    title: 'Senior UX Designer',
    company: 'DesignHub',
    type: 'Full-time',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    match: '95%',
    skills: ['UI/UX', 'Figma', 'User Research', 'Prototyping'],
    posted: '2 days ago',
    isNew: true,
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'TechStart',
    type: 'Full-time',
    location: 'Remote',
    salary: '$110,000 - $140,000',
    match: '88%',
    skills: ['Product Design', 'User Flows', 'Wireframing', 'Sketch'],
    posted: '1 week ago',
    isNew: false,
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'DigitalAgency',
    type: 'Contract',
    location: 'New York, NY',
    salary: '$60 - $80/hr',
    match: '82%',
    skills: ['UI Design', 'Prototyping', 'User Testing', 'Adobe XD'],
    posted: '3 days ago',
    isNew: true,
  },
];

// Chart data
const applicationData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Applications',
      data: [12, 19, 15, 27, 22, 18, 24, 20, 30, 25, 32, 28],
      fill: true,
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      borderColor: 'rgba(79, 70, 229, 0.8)',
      tension: 0.4,
      pointBackgroundColor: 'white',
      pointBorderColor: 'rgba(79, 70, 229, 1)',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

const statusData = {
  labels: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'],
  datasets: [
    {
      label: 'Applications',
      data: [24, 18, 12, 6, 3],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(217, 70, 239, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(244, 63, 94, 0.8)',
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(217, 70, 239, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(244, 63, 94, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'white',
      titleColor: '#1F2937',
      bodyColor: '#4B5563',
      padding: 12,
      borderColor: '#E5E7EB',
      borderWidth: 1,
      usePointStyle: true,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.03)',
      },
      ticks: {
        color: '#6B7280',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#6B7280',
      },
    },
  },
};

const statusChartOptions = {
  ...chartOptions,
  scales: {
    ...chartOptions.scales,
    x: {
      ...chartOptions.scales.x,
      grid: {
        display: false,
      },
    },
  },
};

const PremiumDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewAllJobs, setViewAllJobs] = useState(false);

  const displayedJobs = viewAllJobs ? jobMatches : jobMatches.slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, John!</h1>
            <p className="mt-1 text-indigo-100">Here's what's happening with your job search today.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-indigo-600 bg-white shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ShareIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Share Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative bg-white/70 backdrop-blur-sm overflow-hidden rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.iconBackground} bg-opacity-20`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} aria-hidden="true" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                    {stat.unit && <span className="ml-1 text-sm font-medium text-gray-500">{stat.unit}</span>}
                  </p>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mr-1 -mt-1">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                <ArrowTrendingUpIcon className="-ml-0.5 mr-1 h-3 w-3" />
                {stat.changeType === 'positive' ? 'Up' : 'Down'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Applications Overview</h2>
              <div className="flex space-x-2">
                <select
                  id="timeframe"
                  name="timeframe"
                  className="block w-full pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white/50 border border-gray-200 text-gray-700"
                  defaultValue="year"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
            <div className="h-64">
              <Line data={applicationData} options={chartOptions} />
            </div>
          </div>

          {/* Job Matches */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Your Job Matches</h2>
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => setViewAllJobs(!viewAllJobs)}
              >
                {viewAllJobs ? 'View Less' : 'View All'}
              </button>
            </div>
            <div className="space-y-4">
              {displayedJobs.map((job) => (
                <div
                  key={job.id}
                  className="group relative bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-200 transition-colors duration-200"
                >
                  {job.isNew && (
                    <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      New
                    </span>
                  )}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <BriefcaseIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-gray-900 group-hover:text-indigo-600">
                          {job.title}
                        </h3>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {job.match} Match
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{job.company}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {job.type}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {job.location}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {job.salary}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-500">Posted {job.posted}</p>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Application Status */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Application Status</h2>
            <div className="h-64">
              <Bar data={statusData} options={statusChartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {statusData.labels.map((label, index) => (
                <div key={label} className="flex items-center">
                  <span
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: statusData.datasets[0].backgroundColor[index] }}
                  />
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="ml-auto font-medium text-gray-900">
                    {statusData.datasets[0].data[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View All
              </button>
            </div>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivity.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.iconBackground}`}
                          >
                            <activity.icon className={`h-5 w-5 ${activity.iconColor}`} aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-800">
                              <span className="font-medium text-gray-900">{activity.title}</span>{' '}
                              <span className="text-gray-600">{activity.company}</span>
                            </p>
                            <p className="text-xs text-gray-500">{activity.status}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
            <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
              >
                <BriefcaseIcon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">Post a Job</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
              >
                <UserGroupIcon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">Find Candidates</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
              >
                <ChartBarIcon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">View Reports</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
              >
                <BellIcon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">Notifications</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;
