import React from "react";
import { AvatarCell, EmailCell, ActionsCell } from "./renderers";

export function getUserColumns({ isMobile, onEdit, onDelete }) {
  return [
    {
      title: "",
      dataIndex: "avatar",
      key: "avatar",
      width: "20%",
      render: (src) => <AvatarCell src={src} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      ellipsis: true,
      render: (email) => <EmailCell email={email} />,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <ActionsCell record={record} isMobile={isMobile} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}
