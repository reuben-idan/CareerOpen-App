import { create } from 'zustand'

export interface Post {
  id: string
  author: {
    id: string
    name: string
    title: string
    avatar?: string
  }
  content: string
  image?: string
  likes: number
  comments: Comment[]
  shares: number
  timestamp: string
  isLiked: boolean
  isSaved: boolean
}

export interface Comment {
  id: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
}

interface FeedState {
  posts: Post[]
  isLoading: boolean
  
  // Actions
  addPost: (content: string, image?: string) => void
  likePost: (postId: string) => void
  savePost: (postId: string) => void
  sharePost: (postId: string) => void
  addComment: (postId: string, content: string) => void
  likeComment: (postId: string, commentId: string) => void
  setLoading: (loading: boolean) => void
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [
    {
      id: '1',
      author: {
        id: '1',
        name: 'Sarah Chen',
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
    },
    {
      id: '2',
      author: {
        id: '2',
        name: 'Michael Rodriguez',
        title: 'Product Manager at StartupXYZ',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      },
      content: 'The future of remote work is here! Our team just launched a new collaboration tool that\'s already helping 1000+ companies work more efficiently. Key insight: async communication is the game-changer.',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600',
      likes: 89,
      comments: [],
      shares: 12,
      timestamp: '4 hours ago',
      isLiked: true,
      isSaved: false
    }
  ],
  isLoading: false,

  addPost: (content, image) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        name: 'You',
        title: 'Professional'
      },
      content,
      image,
      likes: 0,
      comments: [],
      shares: 0,
      timestamp: 'Just now',
      isLiked: false,
      isSaved: false
    }
    
    set(state => ({
      posts: [newPost, ...state.posts]
    }))
  },

  likePost: (postId) => {
    set(state => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    }))
  },

  savePost: (postId) => {
    set(state => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    }))
  },

  sharePost: (postId) => {
    set(state => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? { ...post, shares: post.shares + 1 }
          : post
      )
    }))
  },

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
      posts: state.posts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    }))
  },

  likeComment: (postId, commentId) => {
    set(state => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map(comment =>
                comment.id === commentId
                  ? {
                      ...comment,
                      isLiked: !comment.isLiked,
                      likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
                    }
                  : comment
              )
            }
          : post
      )
    }))
  },

  setLoading: (loading) => set({ isLoading: loading })
}))