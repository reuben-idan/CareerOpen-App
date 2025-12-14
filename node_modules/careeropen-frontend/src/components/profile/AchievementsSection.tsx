import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, TrashIcon, TrophyIcon } from '@heroicons/react/24/outline'
import { Card, Button, Input, Textarea } from '@/components/ui'
import { Achievement } from '@/stores/profileStore'

interface AchievementsSectionProps {
  achievements: Achievement[]
  isEditable?: boolean
  onAchievementsChange?: (achievements: Achievement[]) => void
}

export default function AchievementsSection({ achievements, isEditable = false, onAchievementsChange }: AchievementsSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Omit<Achievement, 'id'>>({
    title: '',
    description: '',
    date: '',
    organization: ''
  })

  const handleSave = () => {
    if (!formData.title || !formData.description) return
    
    const newAchievement = { ...formData, id: Date.now().toString() }
    onAchievementsChange?.([...achievements, newAchievement])
    resetForm()
  }

  const handleDelete = (id: string) => {
    const updatedAchievements = achievements.filter(ach => ach.id !== id)
    onAchievementsChange?.(updatedAchievements)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      organization: ''
    })
    setIsAdding(false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-3 text-gray-900">Achievements & Awards</h2>
        {isEditable && (
          <Button
            variant="glass"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Achievement</span>
          </Button>
        )}
      </div>

      {/* Add Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-6 rounded-xl bg-gray-50 space-y-4"
        >
          <Input
            placeholder="Achievement Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Organization (optional)"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>
          
          <Textarea
            placeholder="Description of the achievement..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
          
          <div className="flex space-x-3">
            <Button onClick={handleSave}>
              Add Achievement
            </Button>
            <Button variant="glass" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <TrophyIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {achievement.title}
                    </h3>
                    {achievement.organization && (
                      <p className="text-sm text-yellow-700 font-medium">
                        {achievement.organization}
                      </p>
                    )}
                  </div>
                </div>
                
                {isEditable && (
                  <button
                    onClick={() => handleDelete(achievement.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-red-100 text-red-600 transition-all"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                {achievement.description}
              </p>
              
              <p className="text-xs text-gray-600">
                {formatDate(achievement.date)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-8">
          <TrophyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {isEditable ? 'Showcase your achievements and awards' : 'No achievements listed yet'}
          </p>
          {isEditable && (
            <Button
              variant="glass"
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-2 mx-auto"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Your First Achievement</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}