// components/Post.jsx
import "react";
import PropTypes from "prop-types";

const Post = ({ name, content, likes = 0, comments = 0 }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-gray-800 font-semibold">{name}</h3>
      <p className="text-gray-600 mt-2">{content}</p>
      <div className="flex justify-between text-gray-500 text-sm mt-4">
        <span>
          {likes} {likes === 1 ? "like" : "likes"}
        </span>
        <span>
          {comments} {comments === 1 ? "comment" : "comments"}
        </span>
      </div>
    </div>
  );
};

// Define prop types for validation
Post.propTypes = {
  name: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  likes: PropTypes.number,
  comments: PropTypes.number,
};

// Set default props for optional values
Post.defaultProps = {
  likes: 0,
  comments: 0,
};

export default Post;
