import React from 'react';
import { Form as AntdForm } from 'antd';

const Form = ({ children, onFinish, initialValues, name, ...props }) => {
  return (
    <AntdForm
      name={name}
      initialValues={initialValues}
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      {...props}
    >
      {children}
    </AntdForm>
  );
};

Form.Item = AntdForm.Item;

export default Form;
