import React from 'react';
import { Button as AntdButton } from 'antd';

const Button = ({ children, style, size = 'large', block = true, ...rest }) => {
  return (
    <AntdButton
      {...rest}
      style={{ borderRadius: '2px', width: 'fit-content', ...style }}
      size={size}
      block={block}
      
    >
      {children}
    </AntdButton>
  );
};

export default Button;
