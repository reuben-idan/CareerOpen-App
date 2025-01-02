// components/InvitationCard.jsx
import  "react";
import PropTypes from "prop-types";

const InvitationCard = ({
  name,
  title,
  mutualConnections,
  onAccept,
  onIgnore,
}) => {
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
      <div className="flex space-x-2">
        <button
          onClick={onAccept}
          className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          Accept
        </button>
        <button
          onClick={onIgnore}
          className="px-4 py-1 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-400"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};

InvitationCard.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  mutualConnections: PropTypes.number.isRequired,
  onAccept: PropTypes.func,
  onIgnore: PropTypes.func,
};

InvitationCard.defaultProps = {
  onAccept: () => {},
  onIgnore: () => {},
};

export default InvitationCard;
