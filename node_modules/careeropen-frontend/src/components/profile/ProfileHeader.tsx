import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PencilIcon, 
  ShareIcon, 
  UserPlusIcon, 
  CheckIcon,
  MapPinIcon,
  CameraIcon
} from '@heroicons/react/24/outline'
import { Card, Button, Input, Textarea } from '@/components/ui'
import { Profile } from '@/stores/profileStore'

interface ProfileHeaderProps {
  profile: Profile
  isEditable: boolean
  onProfileUpdate: (updates: Partial<Profile>) => void
  onConnect: () => void
  onShare: () => void
  onAvatarUpdate: (avatar: string) => void
  onCoverUpdate: (coverImage: string) => void
}

export default function ProfileHeader({ 
  profile, 
  isEditable, 
  onProfileUpdate, 
  onConnect, 
  onShare,
  onAvatarUpdate,
  onCoverUpdate
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: profile.name,
    title: profile.title,
    location: profile.location,
    about: profile.about
  })

  const handleSave = () => {
    onProfileUpdate(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      title: profile.title,
      location: profile.location,
      about: profile.about
    })
    setIsEditing(false)
  }

  const handleImageUpload = (type: 'avatar' | 'cover', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === 'avatar') {
          onAvatarUpdate(result)
        } else {
          onCoverUpdate(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-ocean-400 to-ocean-600">
        {profile.coverImage && (
          <img 
            src={profile.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        )}
        {isEditable && (
          <label className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white hover:bg-black/30 transition-colors cursor-pointer">
            <CameraIcon className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload('cover', e)}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <div className="relative inline-block">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-bold">
                {profile.name.charAt(0)}
              </div>
            )}
            {isEditable && (
              <label className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CameraIcon className="w-4 h-4 text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('avatar', e)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Profile Info */}
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 mb-6"
          >
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full Name"
              className="text-xl font-bold"
            />
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Professional Title"
            />
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Location"
            />
            <Textarea
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder="About yourself..."
              rows={4}
            />
            <div className="flex space-x-3">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="glass" onClick={handleCancel}>Cancel</Button>
            </div>
          </motion.div>
        ) : (
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.name}
                </h1>
                <p className="text-xl text-gray-700 mb-2">
                  {profile.title}
                </p>
                {profile.location && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                {isEditable ? (
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={onConnect}
                    className="flex items-center space-x-2"
                    variant={profile.isPendingConnection ? "glass" : "primary"}
                  >
                    {profile.isPendingConnection ? (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        <span>Pending</span>
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="w-4 h-4" />
                        <span>Connect</span>
                      </>
                    )}
                  </Button>
                )}
                
                <Button
                  variant="glass"
                  size="sm"
                  onClick={onShare}
                  className="flex items-center space-x-2"
                >
                  <ShareIcon className="w-4 h-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>

            {/* About */}
            <p className="text-gray-700 leading-relaxed mb-6">
              {profile.about}
            </p>

            {/* Stats */}
            <div className="flex space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {profile.connections.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Connections</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {profile.followers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {profile.following.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}