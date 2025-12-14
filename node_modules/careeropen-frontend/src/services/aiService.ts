import { apiService } from './api'

class AIService {
  // Job Matching
  async analyzeJobMatch(jobId: string) {
    try {
      const response = await fetch(`${apiService.baseUrl}/ai/job-match/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...apiService.getAuthHeaders(),
        },
        body: JSON.stringify({ job_id: jobId }),
      })
      return response.json()
    } catch (error) {
      console.error('Job match analysis error:', error)
      return { error: 'Analysis failed' }
    }
  }

  // Skill Gap Analysis
  async analyzeSkillGaps(jobId: string) {
    try {
      const response = await fetch(`${apiService.baseUrl}/ai/skill-gaps/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...apiService.getAuthHeaders(),
        },
        body: JSON.stringify({ job_id: jobId }),
      })
      return response.json()
    } catch (error) {
      console.error('Skill gap analysis error:', error)
      return { error: 'Analysis failed' }
    }
  }

  // Career Path Suggestions
  async getCareerSuggestions() {
    try {
      const response = await fetch(`${apiService.baseUrl}/ai/career-paths/`, {
        headers: apiService.getAuthHeaders(),
      })
      return response.json()
    } catch (error) {
      console.error('Career suggestions error:', error)
      return { error: 'Suggestions failed' }
    }
  }

  // Profile Optimization
  async optimizeProfile(targetRoles?: string[]) {
    try {
      const url = new URL(`${apiService.baseUrl}/ai/optimize-profile/`)
      if (targetRoles?.length) {
        url.searchParams.set('target_roles', targetRoles.join(','))
      }

      const response = await fetch(url.toString(), {
        headers: apiService.getAuthHeaders(),
      })
      return response.json()
    } catch (error) {
      console.error('Profile optimization error:', error)
      return { error: 'Optimization failed' }
    }
  }

  // Resume Parsing
  async parseResume(file: File) {
    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch(`${apiService.baseUrl}/ai/parse-resume/`, {
        method: 'POST',
        headers: {
          ...apiService.getAuthHeaders(),
          // Don't set Content-Type for FormData
        },
        body: formData,
      })
      return response.json()
    } catch (error) {
      console.error('Resume parsing error:', error)
      return { error: 'Parsing failed' }
    }
  }

  // AI Status
  async getAIStatus() {
    try {
      const response = await fetch(`${apiService.baseUrl}/ai/status/`, {
        headers: apiService.getAuthHeaders(),
      })
      return response.json()
    } catch (error) {
      console.error('AI status error:', error)
      return { error: 'Status check failed' }
    }
  }
}

export const aiService = new AIService()