import React from 'react';
import { Checkbox as AntdCheckbox } from 'antd';

const Checkbox = ({ children, ...props }) => {
  return (
    <AntdCheckbox
      {...props}
      style={{ ...props.style }}
    >
      {children}
    </AntdCheckbox>
  );
};

export default Checkbox;
