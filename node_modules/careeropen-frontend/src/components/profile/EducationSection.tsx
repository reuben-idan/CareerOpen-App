import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { Card, Button, Input, Textarea } from '@/components/ui'
import { Education } from '@/stores/profileStore'

interface EducationSectionProps {
  education: Education[]
  isEditable?: boolean
  onEducationChange?: (education: Education[]) => void
}

export default function EducationSection({ education, isEditable = false, onEducationChange }: EducationSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    degree: '',
    school: '',
    field: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  })

  const handleSave = () => {
    if (!formData.degree || !formData.school) return
    
    let updatedEducation
    if (editingId) {
      updatedEducation = education.map(edu => 
        edu.id === editingId ? { ...formData, id: editingId } : edu
      )
    } else {
      updatedEducation = [...education, { ...formData, id: Date.now().toString() }]
    }
    
    onEducationChange?.(updatedEducation)
    resetForm()
  }

  const handleEdit = (edu: Education) => {
    setFormData(edu)
    setEditingId(edu.id)
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    const updatedEducation = education.filter(edu => edu.id !== id)
    onEducationChange?.(updatedEducation)
  }

  const resetForm = () => {
    setFormData({
      degree: '',
      school: '',
      field: '',
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
        <h2 className="heading-3 text-gray-900">Education</h2>
        {isEditable && (
          <Button
            variant="glass"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Education</span>
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
              placeholder="Degree (e.g., Bachelor of Science)"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            />
            <Input
              placeholder="School/University"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            />
          </div>
          
          <Input
            placeholder="Field of Study"
            value={formData.field}
            onChange={(e) => setFormData({ ...formData, field: e.target.value })}
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
            <span className="text-sm text-gray-700">I currently study here</span>
          </label>
          
          <Textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
          
          <div className="flex space-x-3">
            <Button onClick={handleSave}>
              {editingId ? 'Update' : 'Add'} Education
            </Button>
            <Button variant="glass" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Education List */}
      <div className="space-y-6">
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="flex">
              {/* Timeline */}
              <div className="flex flex-col items-center mr-4">
                <div className="w-3 h-3 bg-ocean-600 rounded-full" />
                {index < education.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-300 mt-2" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-ocean-600 font-medium mb-1">
                      {edu.school}
                    </p>
                    <p className="text-gray-600 mb-2">
                      {edu.field}
                    </p>
                    
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {formatDate(edu.startDate)} - {' '}
                        {edu.isCurrent ? 'Present' : formatDate(edu.endDate || '')}
                      </span>
                    </div>
                    
                    {edu.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                  
                  {isEditable && (
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(edu)}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
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

      {education.length === 0 && (
        <div className="text-center py-8">
          <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {isEditable ? 'Add your educational background' : 'No education listed yet'}
          </p>
          {isEditable && (
            <Button
              variant="glass"
              onClick={() => setIsAdding(true)}
              className="flex items-center space-x-2 mx-auto"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Your Education</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}