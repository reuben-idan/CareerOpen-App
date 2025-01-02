// components/ConnectionCard.jsx
import  "react";
import PropTypes from "prop-types";

const ConnectionCard = ({ name, title, mutualConnections, onRemove }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
      <div className="flex-1">
        <h3 className="text-gray-800 font-semibold">{name}</h3>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-gray-500 text-xs">
          {mutualConnections} mutual connections
        </p>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 text-sm font-medium"
      >
        Remove
      </button>
    </div>
  );
};

ConnectionCard.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  mutualConnections: PropTypes.number.isRequired,
  onRemove: PropTypes.func,
};

ConnectionCard.defaultProps = {
  onRemove: () => {},
};

export default ConnectionCard;
