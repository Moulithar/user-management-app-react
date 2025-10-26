import React from 'react';
import { Card as AntdCard } from 'antd';

const Card = ({ children, width = 450, ...props }) => {
  return (
    <AntdCard
      style={{
        width,
        boxShadow: '0 2px 2px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        ...props.style
      }}
      {...props}
    >
      {children}
    </AntdCard>
  );
};

export default Card;
