import React from "react";
import { Space } from "antd";

import { PlusOutlined, TableOutlined, OrderedListOutlined, SearchOutlined } from "@ant-design/icons";
import Input from "../../../../components/common/Input";
import Button from "../../../../components/common/Button";

export const UserToolbar = ({
  search,
  onSearchChange,
  onCreate,
  viewMode,
  onViewModeChange,
  isMobile,
}) => {
  return (
    <div style={{ padding: "16px 16px 0 16px", backgroundColor: "#FFFFFF" }}>
      <Space direction="vertical" size={isMobile ? 8 : 12} style={{ width: "100%" }}>
        <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>Users</h3>
          <Space align="center" size={isMobile ? 8 : 12}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #d9d9d9",
                borderRadius: 2,
                overflow: "hidden",
                width: "fit-content",
                height: isMobile ? 32 : 40,
              }}
            >
              <Input
                aria-label="Search users"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                  height: "100%",
                  border: "none",
                  boxShadow: "none",
                  padding: isMobile ? "4px 8px" : "8px 12px",
                  width: isMobile ? 160 : 200,
                }}
                bordered={false}
                size={isMobile ? "small" : "middle"}
                allowClear
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: isMobile ? "0 8px" : "0 12px",
                  backgroundColor: "#fafafa",
                  height: "100%",
                  borderLeft: "1px solid #d9d9d9",
                }}
              >
                <SearchOutlined style={{ fontSize: isMobile ? 14 : 16, color: "#8c8c8c" }} />
              </div>
            </div>

            <Button
              aria-label="Create user"
              type="primary"
              onClick={onCreate}
              icon={isMobile ? <PlusOutlined /> : null}
              size={isMobile ? "small" : "middle"}
              style={{ height: isMobile ? 32 : 40, padding: isMobile ? "0 8px" : "0 16px" }}
            >
              {!isMobile && "Create User"}
            </Button>
          </Space>
        </Space>

        <Space size={0}>
          <Button
            size="small"
            icon={<TableOutlined />}
            type="text"
            aria-label="Table view"
            style={{
              color: viewMode === "table" ? "#1677ff" : undefined,
              border: viewMode === "table" ? "1px solid #1677ff" : "1px solid transparent",
              borderRadius: 0,
            }}
            onClick={() => onViewModeChange("table")}
          >
            Table
          </Button>
          <Button
            size="small"
            icon={<OrderedListOutlined />}
            type="text"
            aria-label="Card view"
            style={{
              color: viewMode === "grid" ? "#1677ff" : undefined,
              border: viewMode === "grid" ? "1px solid #1677ff" : "1px solid transparent",
              borderRadius: 0,
            }}
            onClick={() => onViewModeChange("grid")}
          >
            Card
          </Button>
        </Space>
      </Space>
    </div>
  );
};
