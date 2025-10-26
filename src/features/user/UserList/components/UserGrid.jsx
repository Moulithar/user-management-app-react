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

const StyledCard = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  // cursor: pointer;
  padding: 20px;
  text-align: center;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  &:hover .hover-overlay {
    opacity: 1;
    pointer-events: auto;
  }
`;

const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(154, 154, 154, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  transition: all 0.3s ease;
  opacity: 0;
  pointer-events: none;
  border-radius: 12px;
`;

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
          <StyledCard key={user.id}>
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
            <HoverOverlay className="hover-overlay" onClick={(e) => e.stopPropagation()}>
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
            </HoverOverlay>
          </StyledCard>
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
