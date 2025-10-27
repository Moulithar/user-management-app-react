import React from "react";
import Button from "../../../../components/common/Button";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

export const AvatarCell = ({ src, email = "" }) => (
  <div
    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    {/* <p>{src}</p> */}
    <Avatar
      src={src}
      icon={<UserOutlined style={{ color: "black", backgroundColor: "#e7e7e7" , width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center"}}/>}
      onError={() => true} // Fallback to icon on image load error
      style={{
        width: 40,
        height: 40,
      }}
    />
  </div>
);

export const EmailCell = ({ email }) => <a href={`mailto:${email}`}>{email}</a>;

export const ActionsCell = ({ record, isMobile, onEdit, onDelete }) => (
  <div style={{ display: "flex", gap: 8 }}>
    <div style={{ display: "flex", gap: isMobile ? "4px" : "8px" }}>
      <Button
        type="primary"
        onClick={() => onEdit(record)}
        icon={isMobile && <EditOutlined />}
        size={isMobile ? "small" : "middle"}
        style={isMobile ? { minWidth: "20px" } : {}}
      >
        {!isMobile && "Edit"}
      </Button>
      <Button
        type="primary"
        danger
        onClick={() => onDelete(record)}
        icon={isMobile && <DeleteOutlined />}
        size={isMobile ? "small" : "middle"}
        style={isMobile ? { minWidth: "20px" } : {}}
      >
        {!isMobile && "Delete"}
      </Button>
    </div>
  </div>
);
