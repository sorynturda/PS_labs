// src/components/AlertMessage.jsx
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

const AlertMessage = ({ variant, message, dismissible = true, timeout = 5000 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (timeout && message) {
      const timer = setTimeout(() => {
        setShow(false);
      }, timeout);
      
      return () => clearTimeout(timer);
    }
  }, [message, timeout]);

  // If message is empty or null, don't render anything
  if (!message) return null;

  return (
    <Alert 
      variant={variant} 
      onClose={() => setShow(false)} 
      dismissible={dismissible}
      show={show}
    >
      {message}
    </Alert>
  );
};

export default AlertMessage;