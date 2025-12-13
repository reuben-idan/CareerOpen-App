import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  BriefcaseIcon,
  HeartIcon,
  BookmarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { Card, Button, Input, Avatar } from '@/components/ui'
import { useJobStore } from '@/stores/jobStore'

// Mock job data
const mockJobs = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechCorp',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
    location: 'San Francisco, CA',
    type: 'full-time' as const,
    salary: { min: 120000, max: 160000, currency: 'USD', period: 'yearly' as const },
    description: 'We are looking for a Senior React Developer to join our team...',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership'],
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    experience: 'Senior',
    postedAt: '2024-01-15T10:00:00Z',
    isRemote: false,
    isFeatured: true,
    applicants: 45,
    views: 234,
    saved: false,
    applied: false
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'full-time' as const,
    salary: { min: 100000, max: 140000, currency: 'USD', period: 'yearly' as const },
    description: 'Join our fast-growing startup as a Full Stack Engineer...',
    requirements: ['3+ years full-stack experience', 'React and Node.js', 'Startup experience'],
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    experience: 'Mid-level',
    postedAt: '2024-01-14T14:30:00Z',
    isRemote: true,
    isFeatured: false,
    applicants: 23,
    views: 156,
    saved: true,
    applied: false
  },
  {
    id: '3',
    title: 'Frontend Developer',
    company: 'DesignCo',
    location: 'New York, NY',
    type: 'contract' as const,
    salary: { min: 80, max: 120, currency: 'USD', period: 'hourly' as const },
    description: 'We need a talented Frontend Developer for a 6-month project...',
    requirements: ['3+ years frontend experience', 'React expertise', 'Design system experience'],
    skills: ['React', 'CSS', 'Figma', 'Storybook'],
    experience: 'Mid-level',
    postedAt: '2024-01-13T09:15:00Z',
    isRemote: false,
    isFeatured: false,
    applicants: 12,
    views: 89,
    saved: false,
    applied: true
  }
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  const { savedJobs, appliedJobs, saveJob, unsaveJob, applyToJob } = useJobStore()

  // Initialize with mock data
  const jobs = mockJobs.map(job => ({
    ...job,
    saved: savedJobs.includes(job.id),
    applied: appliedJobs.includes(job.id)
  }))

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesLocation = !locationFilter || 
                             job.location.toLowerCase().includes(locationFilter.toLowerCase()) ||
                             (locationFilter.toLowerCase() === 'remote' && job.isRemote)
      
      const matchesType = !typeFilter || job.type === typeFilter

      return matchesSearch && matchesLocation && matchesType
    })
  }, [jobs, searchTerm, locationFilter, typeFilter])

  const formatSalary = (salary: any) => {
    const { min, max, currency, period } = salary
    const formatNumber = (num: number) => {
      if (period === 'yearly' && num >= 1000) {
        return `${(num / 1000).toFixed(0)}k`
      }
      return num.toString()
    }

    const periodText = period === 'hourly' ? '/hr' : period === 'yearly' ? '/year' : '/month'
    return `$${formatNumber(min)} - $${formatNumber(max)}${periodText}`
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    }
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  return (
    <div className="section-padding">
      <div className="container-glass">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="heading-2 text-gray-900 mb-2">
            Job Opportunities
          </h1>
          <p className="body-large text-gray-600">
            Discover your next career move with AI-powered job matching
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <div className="space-y-4">
              {/* Main Search */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search jobs, companies, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
                  />
                </div>
                <div className="lg:w-64">
                  <Input
                    placeholder="Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    leftIcon={<MapPinIcon className="w-5 h-5" />}
                  />
                </div>
                <Button
                  variant="glass"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:w-auto"
                >
                  <FunnelIcon className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-white/20 pt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-4 py-2 rounded-xl glass-input border-0 focus:ring-2 focus:ring-ocean-400"
                    >
                      <option value="">All Job Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                    
                    <select className="px-4 py-2 rounded-xl glass-input border-0 focus:ring-2 focus:ring-ocean-400">
                      <option>All Experience Levels</option>
                      <option>Entry Level</option>
                      <option>Mid-level</option>
                      <option>Senior</option>
                      <option>Executive</option>
                    </select>
                    
                    <select className="px-4 py-2 rounded-xl glass-input border-0 focus:ring-2 focus:ring-ocean-400">
                      <option>All Salary Ranges</option>
                      <option>$50k - $75k</option>
                      <option>$75k - $100k</option>
                      <option>$100k - $150k</option>
                      <option>$150k+</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredJobs.length} jobs
            {searchTerm && ` for "${searchTerm}"`}
            {locationFilter && ` in ${locationFilter}`}
          </p>
        </motion.div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="cursor-pointer">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-ocean-100 rounded-xl flex items-center justify-center">
                          <BriefcaseIcon className="w-6 h-6 text-ocean-600" />
                        </div>
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {job.title}
                          {job.isFeatured && (
                            <span className="ml-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              Featured
                            </span>
                          )}
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                        <span className="font-medium">{job.company}</span>
                        <span className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="capitalize">{job.type.replace('-', ' ')}</span>
                        {job.isRemote && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Remote
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className="text-ocean-600 font-semibold">
                          {formatSalary(job.salary)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {job.applicants} applicants
                        </span>
                        <span className="text-gray-500 text-sm">
                          Posted {getTimeAgo(job.postedAt)}
                        </span>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-ocean-50 text-ocean-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        job.saved ? unsaveJob(job.id) : saveJob(job.id)
                      }}
                      className="p-2 rounded-xl glass-button hover:bg-white/30 transition-colors"
                    >
                      {job.saved ? (
                        <BookmarkSolidIcon className="w-5 h-5 text-ocean-600" />
                      ) : (
                        <BookmarkIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!job.applied) {
                          applyToJob(job.id)
                        }
                      }}
                      disabled={job.applied}
                      className={job.applied ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {job.applied ? 'Applied' : 'Apply'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="glass">Load More Jobs</Button>
          </div>
        )}

        {/* No Results */}
        {filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BriefcaseIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="glass"
              onClick={() => {
                setSearchTerm('')
                setLocationFilter('')
                setTypeFilter('')
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}