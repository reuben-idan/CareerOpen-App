const API_BASE_URL = 'http://localhost:8000/api'

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    return response.json()
  }

  // Authentication
  async register(userData: any) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: any) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getProfile() {
    return this.request('/auth/profile/')
  }

  // Jobs
  async getJobs(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request(`/jobs/${query}`)
  }

  async getJob(id: string) {
    return this.request(`/jobs/${id}/`)
  }

  async createJob(jobData: any) {
    return this.request('/jobs/', {
      method: 'POST',
      body: JSON.stringify(jobData),
    })
  }

  // Applications
  async getApplications() {
    return this.request('/applications/')
  }

  async createApplication(applicationData: any) {
    return this.request('/applications/', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    })
  }

  // Companies
  async getCompanies() {
    return this.request('/companies/')
  }

  async getCompany(id: string) {
    return this.request(`/companies/${id}/`)
  }

  // Profiles
  async getUserProfile() {
    return this.request('/profiles/')
  }

  async updateProfile(profileData: any) {
    return this.request('/profiles/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    })
  }
}

export const apiService = new ApiService()