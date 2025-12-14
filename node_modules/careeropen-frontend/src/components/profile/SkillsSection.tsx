import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Card, Button, Input } from '@/components/ui'
import { Skill } from '@/stores/profileStore'

interface SkillsSectionProps {
  skills: Skill[]
  isEditable?: boolean
  onSkillsChange?: (skills: Skill[]) => void
}

export default function SkillsSection({ skills, isEditable = false, onSkillsChange }: SkillsSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [newLevel, setNewLevel] = useState<Skill['level']>('Intermediate')

  const handleAddSkill = () => {
    if (!newSkill.trim()) return
    
    const updatedSkills = [...skills, { name: newSkill.trim(), level: newLevel }]
    onSkillsChange?.(updatedSkills)
    setNewSkill('')
    setIsAdding(false)
  }

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index)
    onSkillsChange?.(updatedSkills)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 text-green-800'
      case 'Advanced': return 'bg-blue-100 text-blue-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Beginner': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-3 text-gray-900">Skills & Expertise</h2>
        {isEditable && (
          <Button
            variant="glass"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Skill</span>
          </Button>
        )}
      </div>

      {/* Add Skill Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 rounded-xl bg-gray-50"
        >
          <div className="flex space-x-3 mb-3">
            <Input
              placeholder="Skill name (e.g., React, Python, Leadership)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1"
            />
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value as Skill['level'])}
              className="px-3 py-2 rounded-xl border border-gray-300 focus:border-ocean-400 focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleAddSkill}>
              Add Skill
            </Button>
            <Button
              variant="glass"
              size="sm"
              onClick={() => {
                setIsAdding(false)
                setNewSkill('')
              }}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill, index) => (
          <motion.div
            key={`${skill.name}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative group"
          >
            <div className="p-3 rounded-xl bg-white/50 border border-white/30 hover:bg-white/70 transition-all">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{skill.name}</h3>
                {isEditable && (
                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 text-red-600 transition-all"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                  {skill.level}
                </span>
                
                {skill.verified && (
                  <span className="text-xs text-green-600 font-medium flex items-center">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            {isEditable ? 'Add your skills to showcase your expertise' : 'No skills listed yet'}
          </p>
          {isEditable && (
            <Button
              variant="glass"
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-2 mx-auto"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Your First Skill</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}