import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  XMarkIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  EyeIcon,
  UserGroupIcon,
  ShareIcon,
  BookmarkIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Card, Button, Avatar } from '@/components/ui'
import { useJobStore, type Job } from '@/stores/jobStore'

interface JobDetailsModalProps {
  job: Job
  isOpen: boolean
  onClose: () => void
}

export default function JobDetailsModal({ job, isOpen, onClose }: JobDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('description')
  const [isLiked, setIsLiked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const { saveJob, unsaveJob, applyToJob, savedJobs, appliedJobs } = useJobStore()

  const isSaved = savedJobs.includes(job.id)
  const isApplied = appliedJobs.includes(job.id)

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/jobs/${job.id}`
    const text = `Check out this ${job.title} position at ${job.company}`
    
    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        break
    }
    setShowShareMenu(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-ocean-100 rounded-xl flex items-center justify-center">
                <BriefcaseIcon className="w-8 h-8 text-ocean-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h2>
                <p className="text-lg text-gray-600 mb-2">{job.company}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    Posted 2 days ago
                  </span>
                  <span className="flex items-center">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    {job.views || 234} views
                  </span>
                  <span className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-1" />
                    {job.applicants || 45} applicants
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => !isApplied && applyToJob(job.id)}
                disabled={isApplied}
                className={`${isApplied ? 'bg-gray-400' : 'bg-ocean-600 hover:bg-ocean-700'}`}
              >
                {isApplied ? 'Applied' : 'Apply Now'}
              </Button>
              
              <button
                onClick={() => isSaved ? unsaveJob(job.id) : saveJob(job.id)}
                className="p-3 rounded-xl glass-button hover:bg-gray-100 transition-colors"
              >
                {isSaved ? (
                  <BookmarkSolidIcon className="w-5 h-5 text-ocean-600" />
                ) : (
                  <BookmarkIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-3 rounded-xl glass-button hover:bg-gray-100 transition-colors"
              >
                {isLiked ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-3 rounded-xl glass-button hover:bg-gray-100 transition-colors"
                >
                  <ShareIcon className="w-5 h-5 text-gray-500" />
                </button>
                
                {showShareMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border p-2 z-10">
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-md text-sm"
                    >
                      Share on LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-md text-sm"
                    >
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-md text-sm"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-ocean-600">
                ${job.salary?.min.toLocaleString()} - ${job.salary?.max.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">per year</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {[
                { id: 'description', label: 'Job Description' },
                { id: 'company', label: 'About Company' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-ocean-600 text-ocean-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {job.description || 'We are looking for a talented professional to join our team. This is an exciting opportunity to work with cutting-edge technologies and make a real impact on our products and services.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {(job.requirements || [
                      '3+ years of relevant experience',
                      'Strong problem-solving skills',
                      'Excellent communication abilities',
                      'Team collaboration experience'
                    ]).map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-ocean-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-ocean-50 text-ocean-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About {job.company}</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {job.company} is a leading technology company focused on innovation and excellence. 
                    We're committed to creating products that make a difference in people's lives.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Industry:</span>
                      <span className="text-gray-600 ml-2">Technology</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Size:</span>
                      <span className="text-gray-600 ml-2">1000+ employees</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Founded:</span>
                      <span className="text-gray-600 ml-2">2010</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Location:</span>
                      <span className="text-gray-600 ml-2">{job.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Employee Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">4.2</span>
                    <div className="flex text-yellow-400">
                      {'★'.repeat(4)}{'☆'.repeat(1)}
                    </div>
                    <span className="text-gray-500">(127 reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      author: 'Anonymous Employee',
                      role: 'Software Engineer',
                      rating: 5,
                      review: 'Great company culture and excellent work-life balance. The team is very supportive and the projects are challenging.',
                      date: '2 weeks ago'
                    },
                    {
                      author: 'Anonymous Employee', 
                      role: 'Product Manager',
                      rating: 4,
                      review: 'Good opportunities for growth and learning. Management is generally supportive of new ideas.',
                      date: '1 month ago'
                    }
                  ].map((review, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{review.author}</div>
                          <div className="text-sm text-gray-600">{review.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="flex text-yellow-400 text-sm">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                          </div>
                          <div className="text-xs text-gray-500">{review.date}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.review}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}