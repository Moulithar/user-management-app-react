import React from "react";
import Button from "../../../../components/common/Button";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export const AvatarCell = ({ src }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <img src={src} alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%" }} />
  </div>
);

export const EmailCell = ({ email }) => (
  <a href={`mailto:${email}`}>{email}</a>
);

export const ActionsCell = ({ record, isMobile, onEdit, onDelete }) => (
  <div style={{ display: "flex", gap: 8 }}>
    <div style={{ display: 'flex', gap: isMobile ? '4px' : '8px' }}>
      <Button
        type="primary"
        onClick={() => onEdit(record)}
        icon={isMobile && <EditOutlined />}
        size={isMobile ? 'small' : 'middle'}
        style={isMobile ? { minWidth: '20px' } : {}}
      >
        {!isMobile && 'Edit'}
      </Button>
      <Button
        type="primary"
        danger
        onClick={() => onDelete(record)}
        icon={isMobile && <DeleteOutlined />}
        size={isMobile ? 'small' : 'middle'}
        style={isMobile ? { minWidth: '20px' } : {}}
      >
        {!isMobile && 'Delete'}
      </Button>
    </div>
  </div>
);
