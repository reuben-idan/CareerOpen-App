import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useProfileStore } from '@/stores/profileStore'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ExperienceSection from '@/components/profile/ExperienceSection'
import EducationSection from '@/components/profile/EducationSection'
import SkillsSection from '@/components/profile/SkillsSection'
import AchievementsSection from '@/components/profile/AchievementsSection'
import ProfilePosts from '@/components/profile/ProfilePosts'

export default function ProfilePage() {
  const {
    profile,
    initializeProfile,
    updateProfile,
    updateAvatar,
    updateCoverImage,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    removeSkill,
    addAchievement,
    deleteAchievement,
    connectUser,
    shareProfile,
    likePost,
    addComment,
    sharePost
  } = useProfileStore()

  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview')

  // Initialize profile with signed-in user data
  useEffect(() => {
    initializeProfile()
  }, [initializeProfile])

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  const handleExperiencesChange = (experiences: any[]) => {
    updateProfile({ experiences })
  }

  const handleEducationChange = (education: any[]) => {
    updateProfile({ education })
  }

  const handleSkillsChange = (skills: any[]) => {
    updateProfile({ skills })
  }

  const handleAchievementsChange = (achievements: any[]) => {
    updateProfile({ achievements })
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <ProfileHeader
            profile={profile}
            isEditable={profile.isOwnProfile}
            onProfileUpdate={updateProfile}
            onConnect={connectUser}
            onShare={shareProfile}
            onAvatarUpdate={updateAvatar}
            onCoverUpdate={updateCoverImage}
          />
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-white/30">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-ocean-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'activity'
                  ? 'bg-white text-ocean-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Activity
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeTab === 'overview' ? (
            <>
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Experience */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ExperienceSection
                    experiences={profile.experiences}
                    isEditable={profile.isOwnProfile}
                    onExperiencesChange={handleExperiencesChange}
                  />
                </motion.div>

                {/* Education */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <EducationSection
                    education={profile.education}
                    isEditable={profile.isOwnProfile}
                    onEducationChange={handleEducationChange}
                  />
                </motion.div>

                {/* Achievements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <AchievementsSection
                    achievements={profile.achievements}
                    isEditable={profile.isOwnProfile}
                    onAchievementsChange={handleAchievementsChange}
                  />
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Skills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <SkillsSection
                    skills={profile.skills}
                    isEditable={profile.isOwnProfile}
                    onSkillsChange={handleSkillsChange}
                  />
                </motion.div>
              </div>
            </>
          ) : (
            /* Activity Tab */
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ProfilePosts
                  posts={profile.posts}
                  onLikePost={likePost}
                  onAddComment={addComment}
                  onSharePost={sharePost}
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}