import { useState } from 'react';
import { PhotoIcon, LinkIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import GlassCard from '../ui/GlassCard';
import GlassButton from '../ui/GlassButton';

const CreatePost = ({ onCreatePost, user }) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('text');
  const [image, setImage] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;

    const postData = {
      content,
      post_type: postType,
      link_url: linkUrl,
      link_title: linkTitle,
    };

    if (image) {
      postData.image = image;
    }

    onCreatePost(postData);
    
    // Reset form
    setContent('');
    setPostType('text');
    setImage(null);
    setLinkUrl('');
    setLinkTitle('');
    setIsExpanded(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPostType('image');
    }
  };

  return (
    <GlassCard className="p-6 mb-6">
      <div className="flex space-x-3">
        <img
          src={user?.profile?.profile_picture || '/default-avatar.png'}
          alt="Your avatar"
          className="w-12 h-12 rounded-full border-2 border-white/20"
        />
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Share your professional thoughts..."
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
            rows={isExpanded ? 4 : 2}
          />

          {isExpanded && (
            <div className="mt-4 space-y-4">
              {/* Post Type Selection */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setPostType('text')}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                    postType === 'text' ? 'bg-blue-500/30 text-blue-200' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <span className="text-sm">📝 Text</span>
                </button>
                
                <label className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  postType === 'image' ? 'bg-blue-500/30 text-blue-200' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}>
                  <PhotoIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={() => setPostType('link')}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                    postType === 'link' ? 'bg-blue-500/30 text-blue-200' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <LinkIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">Link</span>
                </button>
                
                <button
                  onClick={() => setPostType('career_update')}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                    postType === 'career_update' ? 'bg-blue-500/30 text-blue-200' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <BriefcaseIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">Career Update</span>
                </button>
              </div>

              {/* Image Preview */}
              {image && (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="max-h-48 rounded-lg object-cover"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setPostType('text');
                    }}
                    className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-500"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Link Fields */}
              {postType === 'link' && (
                <div className="space-y-3">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Enter URL..."
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <input
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="Link title (optional)..."
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-white/60">
                  {content.length}/3000 characters
                </div>
                
                <div className="flex space-x-2">
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false);
                      setContent('');
                      setImage(null);
                      setLinkUrl('');
                      setLinkTitle('');
                      setPostType('text');
                    }}
                  >
                    Cancel
                  </GlassButton>
                  
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                  >
                    Post
                  </GlassButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default CreatePost;