import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Card, Button, Input, Textarea } from '@/components/ui'
import { Experience } from '@/stores/profileStore'

interface ExperienceSectionProps {
  experiences: Experience[]
  isEditable?: boolean
  onExperiencesChange?: (experiences: Experience[]) => void
}

export default function ExperienceSection({ experiences, isEditable = false, onExperiencesChange }: ExperienceSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  })

  const handleSave = () => {
    if (!formData.title || !formData.company) return
    
    let updatedExperiences
    if (editingId) {
      updatedExperiences = experiences.map(exp => 
        exp.id === editingId ? { ...formData, id: editingId } : exp
      )
    } else {
      updatedExperiences = [...experiences, { ...formData, id: Date.now().toString() }]
    }
    
    onExperiencesChange?.(updatedExperiences)
    resetForm()
  }

  const handleEdit = (experience: Experience) => {
    setFormData(experience)
    setEditingId(experience.id)
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id)
    onExperiencesChange?.(updatedExperiences)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-3 text-gray-900">Experience</h2>
        {isEditable && (
          <Button
            variant="glass"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Experience</span>
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-6 rounded-xl bg-gray-50 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Job Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          
          <Input
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={formData.isCurrent}
              />
            </div>
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isCurrent}
              onChange={(e) => setFormData({ 
                ...formData, 
                isCurrent: e.target.checked,
                endDate: e.target.checked ? '' : formData.endDate
              })}
              className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
            />
            <span className="text-sm text-gray-700">I currently work here</span>
          </label>
          
          <Textarea
            placeholder="Describe your role, responsibilities, and achievements..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
          
          <div className="flex space-x-3">
            <Button onClick={handleSave}>
              {editingId ? 'Update' : 'Add'} Experience
            </Button>
            <Button variant="glass" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Experience List */}
      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <motion.div
            key={experience.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="flex">
              {/* Timeline */}
              <div className="flex flex-col items-center mr-4">
                <div className="w-3 h-3 bg-ocean-600 rounded-full" />
                {index < experiences.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-300 mt-2" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {experience.title}
                    </h3>
                    <p className="text-ocean-600 font-medium mb-2">
                      {experience.company}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          {formatDate(experience.startDate)} - {' '}
                          {experience.isCurrent ? 'Present' : formatDate(experience.endDate || '')}
                        </span>
                      </div>
                      {experience.location && (
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{experience.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {experience.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {experience.description}
                      </p>
                    )}
                  </div>
                  
                  {isEditable && (
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(experience)}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(experience.id)}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {experiences.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            {isEditable ? 'Add your work experience to build your professional story' : 'No experience listed yet'}
          </p>
          {isEditable && (
            <Button
              variant="glass"
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-2 mx-auto"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Your First Experience</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}