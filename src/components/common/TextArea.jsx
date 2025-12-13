import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable TextArea component for multi-line text input
 */
const TextArea = ({
  id,
  name,
  value,
  onChange,
  placeholder = '',
  className = '',
  rows = 4,
  disabled = false,
  required = false,
  ...rest
}) => {
  return (
    <textarea
      id={id || name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      required={required}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...rest}
    />
  );
};

TextArea.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  rows: PropTypes.number,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

export default TextArea;
