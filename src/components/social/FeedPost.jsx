import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  UserCircleIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";

const FeedPost = ({ post, onLike, onComment, onShare }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [comment, setComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(post.id, comment);
      setComment("");
    }
  };

  const renderMediaPreview = () => {
    if (!post.media) return null;

    switch (post.media.type) {
      case "image":
        return (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={post.media.url}
              alt="Post media"
              className="w-full h-full object-cover"
            />
          </div>
        );
      case "video":
        return (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <video
              src={post.media.url}
              controls
              className="w-full h-full object-cover"
            />
          </div>
        );
      case "document":
        return (
          <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <DocumentIcon className="h-8 w-8 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {post.media.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {post.media.size}
              </p>
            </div>
            <a
              href={post.media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              Download
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Link to={`/profile/${post.author.id}`} className="flex-shrink-0">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
            )}
          </Link>
          <div>
            <Link
              to={`/profile/${post.author.id}`}
              className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
            >
              {post.author.name}
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {post.author.title} •{" "}
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                  Save post
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                  Report post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4">
        <p
          className={`text-gray-800 dark:text-gray-200 whitespace-pre-wrap ${
            !isExpanded && post.content.length > 300 ? "line-clamp-3" : ""
          }`}
        >
          {post.content}
        </p>
        {post.content.length > 300 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
        {renderMediaPreview()}
      </div>

      {/* Post Stats */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>{post.likes} likes</span>
            <span>{post.comments.length} comments</span>
          </div>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            {post.isLiked ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
            <span>Like</span>
          </button>
          <button
            onClick={() =>
              document.getElementById(`comment-${post.id}`).focus()
            }
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span>Comment</span>
          </button>
          <button
            onClick={() => onShare(post.id)}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <ShareIcon className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          {post.comments.slice(0, 3).map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Link
                to={`/profile/${comment.author.id}`}
                className="flex-shrink-0"
              >
                {comment.author.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                )}
              </Link>
              <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2">
                  <Link
                    to={`/profile/${comment.author.id}`}
                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {comment.author.name}
                  </Link>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {comment.content}
                  </p>
                </div>
                <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <button className="hover:text-primary-600 dark:hover:text-primary-400">
                    Like
                  </button>
                  <button className="hover:text-primary-600 dark:hover:text-primary-400">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
          {post.comments.length > 3 && (
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              View all {post.comments.length} comments
            </button>
          )}
        </div>

        {/* Comment Input */}
        <form
          onSubmit={handleSubmitComment}
          className="mt-4 flex items-center space-x-2"
        >
          <input
            id={`comment-${post.id}`}
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedPost;
