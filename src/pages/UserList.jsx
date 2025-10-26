import { Form as AForm, message, Table } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// styled-components no longer needed here; grid moved to UserGrid component
import {
    createUser,
    deleteUser,
    fetchUsers,
    updateUser,
} from "../features/user/userSlice";
import { useMobile } from "../hooks/useMobile";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Button from "../components/common/Button";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { UserGrid } from "./UserList/components/UserGrid";
import { UserToolbar } from "./UserList/components/UserToolbar";
import { CreateUserModal } from "./UserList/components/CreateUserModal";
import { EditUserModal } from "./UserList/components/EditUserModal";

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
  // Edit loading state
  const [updating, setUpdating] = useState(false);

  // Search state
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  
  const filteredData = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return data;
    return data.filter((u) =>
      [u.email, u.first_name, u.last_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [data, debouncedSearch]);

  const isMobile = useMobile();

  const onEdit = useCallback((record) => {
    setEditingUser(record);
    form.setFieldsValue({
      first_name: record.first_name,
      last_name: record.last_name,
      email: record.email,
      avatar: record.avatar,
    });
    setIsModalOpen(true);
  }, [form]);

  const onDelete = useCallback(async (record) => {
    const result = await dispatch(deleteUser({ id: record.id }));
    if (deleteUser.fulfilled.match(result)) {
      message.success(`Deleted ${record.email}`);
    }
  }, [dispatch]);

  // Handlers stored in variables for reuse
  const handlePageChange = useCallback((page) => {
    dispatch(fetchUsers(page));
  }, [dispatch]);

  const handleCreateSubmit = useCallback(async (values) => {
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
  }, [dispatch, createForm]);

  const handleEditSubmit = useCallback(async (values) => {
    if (!editingUser) return;
    setUpdating(true);
    const updates = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      avatar: values.avatar,
    };
    const result = await dispatch(updateUser({ id: editingUser.id, updates }));
    if (updateUser.fulfilled.match(result)) {
      message.success("User updated");
      setIsModalOpen(false);
      setEditingUser(null);
    } else {
      message.error("Failed to update user");
    }
    setUpdating(false);
  }, [dispatch, editingUser]);

  // Cell renderers stored as callbacks
  const renderAvatar = useCallback((src) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src={src} alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%" }} />
    </div>
  ), []);

  const renderEmail = useCallback((email) => (
    <a href={`mailto:${email}`}>{email}</a>
  ), []);

  const renderActions = useCallback((_, record) => (
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
  ), [isMobile, onEdit, onDelete]);

  const columnsMemo = useMemo(() => ([
    { title: "", dataIndex: "avatar", key: "avatar", width: "20%", render: renderAvatar },
    { title: "Email", dataIndex: "email", key: "email", width: "20%", ellipsis: true, render: renderEmail },
    { title: "First Name", dataIndex: "first_name", key: "first_name", width: "20%", ellipsis: true },
    { title: "Last Name", dataIndex: "last_name", key: "last_name", width: "20%", ellipsis: true },
    { title: "Actions", key: "actions", width: "20%", render: renderActions },
  ]), [renderAvatar, renderEmail, renderActions]);

  const tableComponents = useMemo(() => ({
    header: {
      cell: (props) => (
        <th
          {...props}
          style={{
            ...props.style,
            borderRight: "none",
            position: "relative",
            padding: isMobile ? '4px' : '16px 16px',
          }}
        >
          {props.children}
        </th>
      ),
    },
    body: {
      cell: (props) => (
        <td
          {...props}
          style={{
            ...props.style,
            padding: isMobile ? '4px' : '16px 16px',
          }}
        >
          {props.children}
        </td>
      ),
    },
  }), [isMobile]);

  const [viewMode, setViewMode] = useState("table"); 


  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchUsers(1));
  }, [dispatch, token, navigate]);


  return (
    <>
      <div style={{ padding: isMobile ? 8 : 20 }}>
        <UserToolbar
          search={search}
          onSearchChange={setSearch}
          onCreate={() => setIsCreateOpen(true)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isMobile={isMobile}
        />

        {viewMode === "table" ? (
          <Table
            components={tableComponents}
            columns={columnsMemo}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            tableLayout="fixed"
            pagination={{
              current: pagination.page,
              pageSize: pagination.per_page || 5,
              total: pagination.total,
              onChange: handlePageChange,
            }}
          />
        ) : (
          <UserGrid
            users={filteredData}
            pagination={pagination}
            onPageChange={handlePageChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>

      <CreateUserModal
        open={isCreateOpen}
        loading={creating}
        form={createForm}
        onCancel={() => {
          if (!creating) {
            setIsCreateOpen(false);
            createForm.resetFields();
          }
        }}
        onSubmit={handleCreateSubmit}
      />
      <EditUserModal
        open={isModalOpen}
        loading={updating}
        form={form}
        initialValues={editingUser || {}}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};

export default UserList;
