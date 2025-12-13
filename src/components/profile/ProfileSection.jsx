// components/ProfileSection.jsx
import  "react";
import { FaPen } from "react-icons/fa"; // Example icon for edit functionality
import PropTypes from "prop-types"; // Prop validation

const ProfileSection = ({ title, children, onEdit, hasContent }) => {
  return (
    <div className="bg-white shadow-sm rounded-md p-6 mt-6">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
          >
            <FaPen /> Edit
          </button>
        )}
      </div>

      {/* Section Content */}
      {hasContent ? (
        <div className="text-gray-700">{children}</div>
      ) : (
        <div className="text-gray-500 italic">No content available</div>
      )}
    </div>
  );
};

// PropTypes validation for better error handling and type-checking
ProfileSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onEdit: PropTypes.func,
  hasContent: PropTypes.bool,
};

ProfileSection.defaultProps = {
  onEdit: null,
  hasContent: true,
};

export default ProfileSection;
