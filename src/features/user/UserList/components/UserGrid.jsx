import React from "react";
import styled from "styled-components";
import { Pagination } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Button from "../../../../components/common/Button";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
  background: #fff;
  max-width: 70vw;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 100%;
    padding: 8px;
    gap: 8px;
  }
`;

const cardStyle = {
  position: "relative",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "220px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  cursor: "pointer",
  padding: "20px",
  textAlign: "center",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
  },
};

const cardHoverStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "none",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  transition: "opacity 0.3s ease",
  opacity: 0,
  "&:hover": {
    opacity: 1,
  },
};

export const UserGrid = ({
  users,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div style={{ background: "#fff" }}>
      <GridContainer>
        {users.map((user) => (
          <div
            key={user.id}
            style={cardStyle}
            onMouseEnter={(e) => {
              const hoverEl = e.currentTarget.querySelector(".card-hover");
              hoverEl.style.display = "flex";
              setTimeout(() => {
                hoverEl.style.opacity = 1;
              }, 10);
            }}
            onMouseLeave={(e) => {
              const hoverEl = e.currentTarget.querySelector(".card-hover");
              hoverEl.style.opacity = 0;
              setTimeout(() => {
                hoverEl.style.display = "none";
              }, 300);
            }}
          >
            <img
              src={user.avatar}
              alt="avatar"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "16px",
                border: "3px solid #fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
            <div style={{ marginBottom: "8px" }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#333",
                  marginBottom: "4px",
                }}
              >
                {`${user.first_name} ${user.last_name}`}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#666",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {user.email}
              </div>
            </div>
            <div
              className="card-hover"
              style={cardHoverStyle}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                type="primary"
                shape="circle"
                size="large"
                icon={<EditOutlined />}
                onClick={() => onEdit(user)}
                style={{
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#8686E6",
                  borderRadius: "50%",
                }}
              />
              <Button
                danger
                type="primary"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => onDelete(user)}
                style={{
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                }}
              />
            </div>
          </div>
        ))}
      </GridContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px",
          backgroundColor: "#fff",
        }}
      >
        <Pagination
          current={pagination.page}
          pageSize={pagination.per_page || 6}
          total={pagination.total}
          onChange={onPageChange}
          showSizeChanger={false}
          style={{ marginTop: "16px" }}
        />
      </div>
    </div>
  );
};
