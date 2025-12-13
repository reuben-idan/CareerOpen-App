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
  jobs: [],
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