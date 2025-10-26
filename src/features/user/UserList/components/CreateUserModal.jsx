import React from "react";
import { Modal } from "antd";
import { UserForm } from "./UserForm";

export const CreateUserModal = ({ open, loading, form, onCancel, onSubmit }) => {
  return (
    <Modal
      title="Create User"
      open={open}
      onCancel={onCancel}
      footer={null}
      confirmLoading={loading}
      destroyOnHidden
    >
      <UserForm
        form={form}
        submitText={loading ? "Creating..." : "Submit"}
        cancelText="Cancel"
        loading={loading}
        onCancel={onCancel}
        onFinish={onSubmit}
      />
    </Modal>
  );
};
