import React from 'react';
function Text({ children, variant = 'p', className }) {
  const Tag = variant; // Puede ser 'h1', 'p', 'span', etc.
  return <Tag className={className}>{children}</Tag>;
}

export default Text;
