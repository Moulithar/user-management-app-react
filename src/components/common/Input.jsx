import React from 'react';
import { Input as AntdInput } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Input = ({ type = 'text', prefix, ...props }) => {
  const InputComponent = type === 'password' ? AntdInput.Password : AntdInput;
  const prefixIcon = prefix === 'user' ? <UserOutlined /> : prefix === 'lock' ? <LockOutlined /> : null;

  return (
    <InputComponent
      {...props}
      style={{ ...props.style, borderRadius: '4px' }}
      prefix={prefixIcon}
      size="large"
    />
  );
};

export default Input;
