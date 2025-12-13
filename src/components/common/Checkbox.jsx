import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Checkbox component for form inputs
 */
const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  label,
  disabled = false,
  required = false,
  className = '',
  ...rest
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id || name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        {...rest}
      />
      {label && (
        <label 
          htmlFor={id || name} 
          className={`ml-2 block text-sm text-gray-700 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Checkbox;
