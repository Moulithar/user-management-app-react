import React from "react";
import { Modal } from "antd";
import { UserForm } from "../../../components/user/UserForm";

export const EditUserModal = ({ open, loading, form, initialValues, onCancel, onSubmit }) => {
  return (
    <Modal
      title="Edit User"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <UserForm
        form={form}
        initialValues={initialValues}
        submitText={loading ? "Updating..." : "Submit"}
        cancelText="Cancel"
        loading={loading}
        onCancel={onCancel}
        onFinish={onSubmit}
      />
    </Modal>
  );
};
