import  "react";
import PropTypes from "prop-types";

const Recommendations = ({ recommendations }) => {
  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <div key={rec.id} className="border-b pb-4">
          <p className="font-semibold">{rec.recommender}</p>
          <p className="text-sm text-gray-600">{rec.message}</p>
        </div>
      ))}
    </div>
  );
};

// PropTypes validation
Recommendations.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      recommender: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Recommendations;
