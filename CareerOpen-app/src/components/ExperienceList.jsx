import  "react";
import PropTypes from "prop-types";

const EducationList = ({ education }) => {
  return (
    <div className="space-y-4">
      {education.map((item) => (
        <div key={item.id} className="border-b pb-4">
          <h3 className="font-semibold text-lg">{item.degree}</h3>
          <p className="text-gray-600">{item.institution}</p>
          <p className="text-sm text-gray-500">{item.duration}</p>
        </div>
      ))}
    </div>
  );
};

// PropTypes validation
EducationList.propTypes = {
  education: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Validate `id` as string or number
      degree: PropTypes.string.isRequired, // Validate `degree` as a required string
      institution: PropTypes.string.isRequired, // Validate `institution` as a required string
      duration: PropTypes.string.isRequired, // Validate `duration` as a required string
    })
  ).isRequired,
};

export default EducationList;
