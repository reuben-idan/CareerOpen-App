import "react";
import PropTypes from "prop-types";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";

const FeedPost = ({ post }) => {
  return (
    <div className="bg-white p-4 shadow-md mb-4 rounded-lg">
      <div className="flex items-center mb-3">
        <img
          src={post.user.profilePicture}
          alt={post.user.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold">{post.user.name}</p>
          <p className="text-sm text-gray-500">{post.timestamp}</p>
        </div>
      </div>
      <p className="mb-4">{post.content}</p>
      <div className="flex justify-between text-gray-600 text-sm">
        <button className="flex items-center space-x-1">
          <FaThumbsUp />
          <span>Like</span>
        </button>
        <button className="flex items-center space-x-1">
          <FaComment />
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1">
          <FaShare />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

FeedPost.propTypes = {
  post: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      profilePicture: PropTypes.string.isRequired,
    }).isRequired,
    timestamp: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default FeedPost;
