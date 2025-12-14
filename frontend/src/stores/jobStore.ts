import { create } from 'zustand'

export interface Job {
  id: string
  title: string
  company: string
  companyLogo?: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote'
  salary?: {
    min: number
    max: number
    currency: string
    period: 'hourly' | 'monthly' | 'yearly'
  }
  description: string
  requirements: string[]
  benefits?: string[]
  skills: string[]
  experience: string
  postedAt: string
  expiresAt?: string
  isRemote: boolean
  isFeatured: boolean
  applicants?: number
  views?: number
  saved?: boolean
  applied?: boolean
}

export interface JobFilters {
  search: string
  location: string
  type: string[]
  experience: string[]
  salary: {
    min: number
    max: number
  }
  remote: boolean
  skills: string[]
}

interface JobState {
  jobs: Job[]
  savedJobs: string[]
  appliedJobs: string[]
  filters: JobFilters
  isLoading: boolean
  error: string | null
  
  // Actions
  setJobs: (jobs: Job[]) => void
  addJob: (job: Job) => void
  updateJob: (id: string, updates: Partial<Job>) => void
  removeJob: (id: string) => void
  
  // Filters
  setFilters: (filters: Partial<JobFilters>) => void
  resetFilters: () => void
  
  // User actions
  saveJob: (jobId: string) => void
  unsaveJob: (jobId: string) => void
  applyToJob: (jobId: string) => void
  
  // Loading states
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const defaultFilters: JobFilters = {
  search: '',
  location: '',
  type: [],
  experience: [],
  salary: { min: 0, max: 500000 },
  remote: false,
  skills: []
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'TechCorp',
      companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: { min: 120000, max: 160000, currency: 'USD', period: 'yearly' },
      description: 'We are looking for a Senior React Developer to join our innovative team and build cutting-edge web applications.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership', 'GraphQL knowledge'],
      benefits: ['Health insurance', 'Stock options', 'Flexible hours', 'Remote work'],
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
      type: 'full-time',
      salary: { min: 100000, max: 140000, currency: 'USD', period: 'yearly' },
      description: 'Join our fast-growing startup as a Full Stack Engineer and help shape the future of our platform.',
      requirements: ['3+ years full-stack experience', 'React and Node.js', 'Startup experience', 'AWS knowledge'],
      benefits: ['Equity package', 'Unlimited PTO', 'Learning budget', 'Home office setup'],
      skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      experience: 'Mid-level',
      postedAt: '2024-01-14T14:30:00Z',
      isRemote: true,
      isFeatured: false,
      applicants: 23,
      views: 156,
      saved: false,
      applied: false
    }
  ],
  savedJobs: [],
  appliedJobs: [],
  filters: defaultFilters,
  isLoading: false,
  error: null,
  
  setJobs: (jobs) => set({ jobs }),
  
  addJob: (job) => set((state) => ({ 
    jobs: [job, ...state.jobs] 
  })),
  
  updateJob: (id, updates) => set((state) => ({
    jobs: state.jobs.map(job => 
      job.id === id ? { ...job, ...updates } : job
    )
  })),
  
  removeJob: (id) => set((state) => ({
    jobs: state.jobs.filter(job => job.id !== id)
  })),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  resetFilters: () => set({ filters: defaultFilters }),
  
  saveJob: (jobId) => set((state) => {
    const savedJobs = state.savedJobs.includes(jobId)
      ? state.savedJobs
      : [...state.savedJobs, jobId]
    
    const jobs = state.jobs.map(job =>
      job.id === jobId ? { ...job, saved: true } : job
    )
    
    return { savedJobs, jobs }
  }),
  
  unsaveJob: (jobId) => set((state) => {
    const savedJobs = state.savedJobs.filter(id => id !== jobId)
    const jobs = state.jobs.map(job =>
      job.id === jobId ? { ...job, saved: false } : job
    )
    
    return { savedJobs, jobs }
  }),
  
  applyToJob: (jobId) => set((state) => {
    const appliedJobs = state.appliedJobs.includes(jobId)
      ? state.appliedJobs
      : [...state.appliedJobs, jobId]
    
    const jobs = state.jobs.map(job =>
      job.id === jobId ? { ...job, applied: true } : job
    )
    
    return { appliedJobs, jobs }
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))