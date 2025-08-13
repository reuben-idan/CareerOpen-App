import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Input component for form fields
 */
const Input = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = '',
  disabled = false,
  required = false,
  ...rest
}) => {
  return (
    <input
      id={id || name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...rest}
    />
  );
};

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

export default Input;
