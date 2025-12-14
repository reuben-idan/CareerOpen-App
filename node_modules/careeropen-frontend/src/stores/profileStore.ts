import { create } from 'zustand'
import { Post, Comment } from './feedStore'
import { useAuthStore } from './authStore'

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  school: string
  field: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description?: string
}

export interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  verified?: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  organization?: string
}

export interface Profile {
  id: string
  name: string
  title: string
  location: string
  about: string
  avatar?: string
  coverImage?: string
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  achievements: Achievement[]
  posts: Post[]
  connections: number
  followers: number
  following: number
  isOwnProfile: boolean
  isConnected: boolean
  isPendingConnection: boolean
}

interface ProfileState {
  profile: Profile | null
  isLoading: boolean
  isEditing: boolean
  
  // Actions
  initializeProfile: () => void
  setProfile: (profile: Profile) => void
  updateProfile: (updates: Partial<Profile>) => void
  updateAvatar: (avatar: string) => void
  updateCoverImage: (coverImage: string) => void
  setEditing: (editing: boolean) => void
  addExperience: (experience: Omit<Experience, 'id'>) => void
  updateExperience: (id: string, experience: Partial<Experience>) => void
  deleteExperience: (id: string) => void
  addEducation: (education: Omit<Education, 'id'>) => void
  updateEducation: (id: string, education: Partial<Education>) => void
  deleteEducation: (id: string) => void
  addSkill: (skill: Skill) => void
  removeSkill: (skillName: string) => void
  addAchievement: (achievement: Omit<Achievement, 'id'>) => void
  deleteAchievement: (id: string) => void
  connectUser: () => void
  followUser: () => void
  shareProfile: () => void
  likePost: (postId: string) => void
  addComment: (postId: string, content: string) => void
  sharePost: (postId: string) => void
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  isEditing: false,

  initializeProfile: () => {
    const { user } = useAuthStore.getState()
    if (user && !get().profile) {
      set({
        profile: {
          id: user.id,
          name: user.name,
          title: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          about: 'Passionate software engineer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Always eager to learn and tackle new challenges in the ever-evolving tech landscape.',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
          coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
          experiences: [
            {
              id: '1',
              title: 'Senior Software Engineer',
              company: 'TechCorp',
              location: 'San Francisco, CA',
              startDate: '2022-01-01',
              isCurrent: true,
              description: 'Leading development of microservices architecture serving 1M+ users. Built scalable APIs using Node.js and React. Mentored junior developers and improved team productivity by 30%.'
            },
            {
              id: '2',
              title: 'Software Engineer',
              company: 'StartupXYZ',
              location: 'San Francisco, CA',
              startDate: '2020-06-01',
              endDate: '2021-12-31',
              isCurrent: false,
              description: 'Built full-stack applications using React and Node.js. Implemented CI/CD pipelines and reduced deployment time by 50%. Collaborated with design team to create intuitive user interfaces.'
            }
          ],
          education: [
            {
              id: '1',
              degree: 'Bachelor of Science',
              school: 'Stanford University',
              field: 'Computer Science',
              startDate: '2016-09-01',
              endDate: '2020-05-01',
              isCurrent: false,
              description: 'Graduated Magna Cum Laude. Focused on software engineering and machine learning.'
            }
          ],
          skills: [
            { name: 'React', level: 'Expert', verified: true },
            { name: 'TypeScript', level: 'Advanced', verified: true },
            { name: 'Node.js', level: 'Advanced' },
            { name: 'Python', level: 'Intermediate' },
            { name: 'AWS', level: 'Intermediate' },
            { name: 'Docker', level: 'Intermediate' },
            { name: 'GraphQL', level: 'Advanced' },
            { name: 'PostgreSQL', level: 'Intermediate' }
          ],
          achievements: [
            {
              id: '1',
              title: 'Employee of the Year',
              description: 'Recognized for outstanding performance and leadership in Q4 2023',
              date: '2023-12-01',
              organization: 'TechCorp'
            },
            {
              id: '2',
              title: 'AWS Certified Solutions Architect',
              description: 'Professional level certification in AWS cloud architecture',
              date: '2023-08-15',
              organization: 'Amazon Web Services'
            }
          ],
          posts: [
            {
              id: '1',
              author: {
                id: user.id,
                name: user.name,
                title: 'Senior Software Engineer at TechCorp',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
              },
              content: 'Just completed a major project using React and TypeScript! The new architecture improved our app performance by 40%. Excited to share some key learnings about component optimization and state management. #React #TypeScript #WebDev',
              likes: 127,
              comments: [
                {
                  id: '1',
                  author: { id: '2', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
                  content: 'Great insights! Would love to hear more about the optimization techniques you used.',
                  timestamp: '1 hour ago',
                  likes: 5,
                  isLiked: false
                }
              ],
              shares: 8,
              timestamp: '2 hours ago',
              isLiked: false,
              isSaved: false
            }
          ],
          connections: 500,
          followers: 1200,
          following: 350,
          isOwnProfile: true,
          isConnected: false,
          isPendingConnection: false
        }
      })
    }
  },

  setProfile: (profile) => set({ profile }),
  
  updateProfile: (updates) => set(state => ({
    profile: state.profile ? { ...state.profile, ...updates } : null
  })),

  updateAvatar: (avatar) => set(state => ({
    profile: state.profile ? { ...state.profile, avatar } : null
  })),

  updateCoverImage: (coverImage) => set(state => ({
    profile: state.profile ? { ...state.profile, coverImage } : null
  })),

  setEditing: (editing) => set({ isEditing: editing }),

  addExperience: (experience) => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      experiences: [{ ...experience, id: Date.now().toString() }, ...state.profile.experiences]
    } : null
  })),

  updateExperience: (id, updates) => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      experiences: state.profile.experiences.map(exp =>
        exp.id === id ? { ...exp, ...updates } : exp
      )
    } : null
  })),

  deleteExperience: (id) => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      experiences: state.profile.experiences.filter(exp => exp.id !== id)
    } : null
  })),

  addEducation: (education) => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      education: [{ ...education, id: Date.now().toString() }, ...state.profile.education]
    } : null
  })),

  updateEducation: (id, updates) => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      education: state.profile.education.map(edu =>
        edu.id === id ? { ...edu, ...updates } : edu
      )
    } : null
  })),

  deleteEducation: (id) => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      education: state.profile.education.filter(edu => edu.id !== id)
    } : null
  })),

  addSkill: (skill) => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      skills: [...state.profile.skills, skill]
    } : null
  })),

  removeSkill: (skillName) => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      skills: state.profile.skills.filter(skill => skill.name !== skillName)
    } : null
  })),

  addAchievement: (achievement) => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      achievements: [{ ...achievement, id: Date.now().toString() }, ...state.profile.achievements]
    } : null
  })),

  deleteAchievement: (id) => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      achievements: state.profile.achievements.filter(ach => ach.id !== id)
    } : null
  })),

  connectUser: () => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      isPendingConnection: !state.profile.isPendingConnection,
      connections: state.profile.isPendingConnection ? state.profile.connections - 1 : state.profile.connections + 1
    } : null
  })),

  followUser: () => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      followers: state.profile.followers + 1
    } : null
  })),

  shareProfile: () => {
    if (navigator.share) {
      navigator.share({
        title: get().profile?.name,
        text: `Check out ${get().profile?.name}'s profile on CareerOpen`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  },

  likePost: (postId) => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      posts: state.profile.posts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    } : null
  })),

  addComment: (postId, content) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        name: 'You'
      },
      content,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    }

    set(state => ({
      profile: state.profile ? {
        ...state.profile,
        posts: state.profile.posts.map(post =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      } : null
    }))
  },

  sharePost: (postId) => set(state => ({
    profile: state.profile ? {
      ...state.profile,
      posts: state.profile.posts.map(post =>
        post.id === postId
          ? { ...post, shares: post.shares + 1 }
          : post
      )
    } : null
  }))
}))