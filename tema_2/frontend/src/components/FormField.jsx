// src/components/FormField.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder = '',
  required = false,
  disabled = false,
  as = 'input',
  options = [],
  className = '',
  ...props
}) => {
  return (
    <Form.Group className={`mb-3 ${className}`}>
      {label && <Form.Label>{label}{required && <span className="text-danger">*</span>}</Form.Label>}
      
      {as === 'select' ? (
        <Form.Select
          name={name}
          value={value || ''}
          onChange={onChange}
          isInvalid={!!error}
          disabled={disabled}
          required={required}
          {...props}
        >
          <option value="">-- Select {label} --</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      ) : as === 'textarea' ? (
        <Form.Control
          as="textarea"
          rows={4}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          isInvalid={!!error}
          disabled={disabled}
          required={required}
          {...props}
        />
      ) : (
        <Form.Control
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          isInvalid={!!error}
          disabled={disabled}
          required={required}
          {...props}
        />
      )}
      
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};

export default FormField;