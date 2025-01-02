import  "react";
import PropTypes from "prop-types";

const SkillsList = ({ skills }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {skills.map((skill) => (
        <span
          key={skill.id}
          className="bg-gray-200 px-4 py-2 rounded-full text-sm font-medium"
        >
          {skill.name}
        </span>
      ))}
    </div>
  );
};

// PropTypes validation
SkillsList.propTypes = {
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SkillsList;
