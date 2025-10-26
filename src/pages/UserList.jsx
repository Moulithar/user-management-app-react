import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, Card, Modal, Form as AForm, message, Pagination } from "antd";
import {
  fetchUsers,
  updateUser,
  deleteUser,
  createUser,
} from "../features/user/userSlice";
// Header actions (logout) are handled in AppLayout now
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import {
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  OrderedListOutlined,
  SearchOutlined,
  TableOutlined,
} from "@ant-design/icons";

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading, pagination } = useSelector((state) => state.users);
  const { token } = useSelector((state) => state.auth);

  // Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = AForm.useForm();

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm] = AForm.useForm();
  const [creating, setCreating] = useState(false);

  // Search state
  const [search, setSearch] = useState("");
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((u) =>
      [u.email, u.first_name, u.last_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [data, search]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchUsers(1));
  }, [dispatch, token, navigate]);

  const onEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      first_name: record.first_name,
      last_name: record.last_name,
      email: record.email,
      avatar: record.avatar,
    });
    setIsModalOpen(true);
  };

  const onDelete = async (record) => {
    const result = await dispatch(deleteUser({ id: record.id }));
    if (deleteUser.fulfilled.match(result)) {
      message.success(`Deleted ${record.email}`);
    } else {
    }
  };

  const columns = [
    {
      title: "",
      dataIndex: "avatar",
      key: "avatar",
      width: "20%",
      render: (src) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={src}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      ellipsis: true,
      render: (email) => <a href={`mailto:${email}`}>{email}</a>,
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
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => onDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Logout moved to AppLayout header
  const components = {
    header: {
      cell: (props) => (
        <th
          {...props}
          style={{
            ...props.style,
            borderRight: "none",
            position: "relative",
          }}
        >
          {props.children}
          <style jsx>{`
            :not(:last-child)::before {
              display: none !important;
            }
          `}</style>
        </th>
      ),
    },
  };

  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // Add these styles at the top of your component
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#fff",
    maxWidth: "70vw",
    margin: "0 auto",
  };

  // Update the cardStyle and cardHoverStyle
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

  //   useEffect(() => {
  //     console.log("Pagination state:", {
  //       viewMode,
  //       currentPage,
  //       pageSize,
  //       pagination: {
  //         page: pagination.page,
  //         per_page: pagination.per_page,
  //         total: pagination.total,
  //       },
  //       filteredDataLength: filteredData.length,
  //     });
  //   }, [viewMode, currentPage, pageSize, pagination, filteredData.length]);

  return (
    <>
      <div style={{ padding: 20 }}>
        <div
          style={{ padding: "16px 16px 0 16px", backgroundColor: "#FFFFFF" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h3>Users</h3>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #d9d9d9",
                  borderRadius: "2px",
                  overflow: "hidden",
                  width: "fit-content",
                }}
              >
                <Input
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    minWidth: 240,
                    border: "none",
                    boxShadow: "none",
                  }}
                  bordered={false}
                  allowClear
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 12px",
                    backgroundColor: "#fafafa",
                    height: "40px",
                    borderLeft: "1px solid #d9d9d9",
                    flex: 1,
                  }}
                >
                  <SearchOutlined
                    style={{
                      fontSize: 16,
                      color: "#8c8c8c",
                      cursor: "pointer",
                      background: "transparent",
                    }}
                  />
                </div>
              </div>
              <Button type="primary" onClick={() => setIsCreateOpen(true)}>
                Create User
              </Button>
              {/* Logout is in AppLayout header */}
            </div>
          </div>
          <div>
            <Button
              size="small"
              icon={<TableOutlined />}
              type="text"
              style={{
                color: viewMode === "table" ? "#1677ff" : undefined,
                border:
                  viewMode === "table"
                    ? "1px solid #1677ff"
                    : "1px solid transparent",
                borderRadius: 0,
              }}
              onClick={() => setViewMode("table")}
            >
              Table
            </Button>
            <Button
              size="small"
              icon={<OrderedListOutlined />}
              type="text"
              style={{
                color: viewMode === "grid" ? "#1677ff" : undefined,
                border:
                  viewMode === "grid"
                    ? "1px solid #1677ff"
                    : "1px solid transparent",
                borderRadius: 0,
              }}
              onClick={() => setViewMode("grid")}
            >
              Card
            </Button>
          </div>
        </div>

        {viewMode === "table" ? (
          <Table
            components={components}
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            tableLayout="fixed"
            pagination={{
              current: pagination.page,
              pageSize: pagination.per_page || 5,
              total: pagination.total,
              onChange: (page) => dispatch(fetchUsers(page)),
            }}
          />
        ) : (
          <div style={{ background: "#fff" }}>
            <div style={gridContainerStyle}>
              {filteredData.map((user) => (
                <div
                  key={user.id}
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    const hoverEl =
                      e.currentTarget.querySelector(".card-hover");
                    hoverEl.style.display = "flex";
                    setTimeout(() => {
                      hoverEl.style.opacity = 1;
                    }, 10);
                  }}
                  onMouseLeave={(e) => {
                    const hoverEl =
                      e.currentTarget.querySelector(".card-hover");
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
                      // size="large"
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
            </div>
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
                total={pagination.total} // Changed from filteredData.length to pagination.total
                onChange={(page) => {
                  console.log(
                    "Grid pagination change - Page:",
                    page,
                    "Total items:",
                    pagination.total
                  );
                  dispatch(fetchUsers(page));
                  //   window.scrollTo(0, 0);
                }}
                showSizeChanger={false}
                style={{ marginTop: "16px" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <Modal
        title="Create User"
        open={isCreateOpen}
        onCancel={() => {
          if (!creating) {
            setIsCreateOpen(false);
            createForm.resetFields();
          }
        }}
        footer={null}
        confirmLoading={creating}
        destroyOnClose
      >
        <AForm
          form={createForm}
          layout="vertical"
          onFinish={async (values) => {
            setCreating(true);
            const payload = {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              avatar: values.avatar,
            };
            const result = await dispatch(createUser(payload));
            setCreating(false);
            if (createUser.fulfilled.match(result)) {
              message.success("User created");
              setIsCreateOpen(false);
              createForm.resetFields();
            } else {
              message.error("Failed to create user");
            }
          }}
        >
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
              {
                required: true,
                type: "email",
                message: "Valid email is required",
              },
            ]}
          >
            <Input placeholder="Email" />
          </AForm.Item>
          <AForm.Item
            label="Profile Image URL"
            name="avatar"
            rules={[
              { required: true, message: "Profile image URL is required" },
            ]}
          >
            <Input placeholder="https://..." />
          </AForm.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button
              onClick={() => {
                if (!creating) {
                  setIsCreateOpen(false);
                  createForm.resetFields();
                }
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" disabled={creating}>
              {creating ? "Creating..." : "Submit"}
            </Button>
          </div>
        </AForm>
      </Modal>
      <Modal
        title="Edit User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <AForm
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            if (!editingUser) return;
            const updates = {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              avatar: values.avatar,
            };
            const result = await dispatch(
              updateUser({ id: editingUser.id, updates })
            );
            if (updateUser.fulfilled.match(result)) {
              message.success("User updated");
              setIsModalOpen(false);
              setEditingUser(null);
            } else {
              message.error("Failed to update user");
            }
          }}
        >
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
              {
                required: true,
                type: "email",
                message: "Valid email is required",
              },
            ]}
          >
            <Input placeholder="Email" />
          </AForm.Item>
          <AForm.Item
            label="Profile Image URL"
            name="avatar"
            rules={[
              { required: true, message: "Profile image URL is required" },
            ]}
          >
            <Input placeholder="https://..." />
          </AForm.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </AForm>
      </Modal>
    </>
  );
};

export default UserList;
