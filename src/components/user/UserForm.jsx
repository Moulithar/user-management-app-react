import React, { useEffect } from "react";
import { Form as AForm } from "antd";
import Input from "../common/Input";
import Button from "../common/Button";

const UserForm = ({
  form,
  onFinish,
  onCancel,
  loading = false,
  initialValues = {},
  submitText = "Submit",
  cancelText = "Cancel",
  layout = "vertical",
}) => {
  const [formInstance] = AForm.useForm();
  const formToUse = form || formInstance;

  useEffect(() => {
    if (initialValues) {
      formToUse.setFieldsValue(initialValues);
    } else {
      formToUse.resetFields();
    }
  }, [initialValues, formToUse]);

  return (
    <AForm form={formToUse} layout={layout} onFinish={onFinish}>
      <AForm.Item
        label="First Name"
        name="first_name"
        rules={[{ required: true, message: "First name is required" }]}
      >
        <Input placeholder="First name" />
      </AForm.Item>

      <AForm.Item
        label="Last Name"
        name="last_name"
        rules={[{ required: true, message: "Last name is required" }]}
      >
        <Input placeholder="Last name" />
      </AForm.Item>

      <AForm.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Valid email is required", type: "email" },
        ]}
      >
        <Input placeholder="Email" />
      </AForm.Item>

      <AForm.Item
        label="Profile Image URL"
        name="avatar"
        rules={[{ required: true, message: "Profile image URL is required" }]}
      >
        <Input placeholder="https://reqres.in/img/faces/1-image.jpg" />
      </AForm.Item>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button type="primary" htmlType="submit" disabled={loading}>
          {submitText}
        </Button>
      </div>
    </AForm>
  );
};

export { UserForm };
