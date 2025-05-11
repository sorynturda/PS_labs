// src/components/StatusBadge.jsx
import React from 'react';
import { Badge } from 'react-bootstrap';

const StatusBadge = ({ status, customVariants = null }) => {
  // Default variant mapping
  const defaultVariants = {
    'NEW': 'info',
    'IN_PROGRESS': 'warning',
    'COMPLETED': 'success',
    'ACTIVE': 'success',
    'INACTIVE': 'danger'
  };
  
  // Use custom variants if provided, otherwise use defaults
  const variants = customVariants || defaultVariants;
  
  // Get the variant based on status
  const variant = variants[status] || 'secondary';
  
  // Format the status for display
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    
    // Convert from snake case to title case
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Badge bg={variant} className="py-2 px-3">
      {formatStatus(status)}
    </Badge>
  );
};

export default StatusBadge;