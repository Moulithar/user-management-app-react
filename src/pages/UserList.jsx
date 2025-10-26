import { Form as AForm, message, Table } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { useInitialUsersFetch } from "../hooks/useInitialUsersFetch";
import { UserGrid } from "../features/user/UserList/components/UserGrid";
import { UserToolbar } from "../features/user/UserList/components/UserToolbar";
import { CreateUserModal } from "../features/user/UserList/components/CreateUserModal";
import { EditUserModal } from "../features/user/UserList/components/EditUserModal";
import { openCreate, closeCreate, openEdit, closeEdit, setViewMode } from "../features/user/userUiSlice";

const UserList = () => {
  const dispatch = useDispatch();
  
  const { data, loading, pagination } = useSelector((state) => state.users);
  const { viewMode, isCreateOpen, isEditOpen, editingUser } = useSelector((state) => state.userUi);

  const [form] = AForm.useForm();
  const [createForm] = AForm.useForm();
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const isMobile = useMobile();

  useAuthRedirect();
  useInitialUsersFetch();
  
  const filteredData = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return data;
    return data.filter((u) =>
      [u.email, u.first_name, u.last_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [data, debouncedSearch]);

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
      dispatch(closeCreate());
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
      dispatch(closeEdit());
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
          onClick={() => dispatch(openEdit(record))}
          icon={isMobile && <EditOutlined />}
          size={isMobile ? 'small' : 'middle'}
          style={isMobile ? { minWidth: '20px' } : {}}
        >
          {!isMobile && 'Edit'}
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => dispatch(deleteUser({ id: record.id }))}
          icon={isMobile && <DeleteOutlined />}
          size={isMobile ? 'small' : 'middle'}
          style={isMobile ? { minWidth: '20px' } : {}}
        >
          {!isMobile && 'Delete'}
        </Button>
      </div>
    </div>
  ), [dispatch, isMobile]);

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



  return (
    <>
      <div style={{ padding: isMobile ? 8 : 20 }}>
        <UserToolbar
          search={search}
          onSearchChange={setSearch}
          onCreate={() => dispatch(openCreate())}
          viewMode={viewMode}
          onViewModeChange={(mode) => dispatch(setViewMode(mode))}
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
              onChange: (page) => dispatch(fetchUsers(page)),
            }}
          />
        ) : (
          <UserGrid
            users={filteredData}
            pagination={pagination}
            onPageChange={(page) => dispatch(fetchUsers(page))}
            onEdit={(record) => dispatch(openEdit(record))}
            onDelete={(record) => dispatch(deleteUser({ id: record.id }))}
          />
        )}
      </div>

      <CreateUserModal
        open={isCreateOpen}
        loading={creating}
        form={createForm}
        onCancel={() => {
          if (!creating) {
            dispatch(closeCreate());
            createForm.resetFields();
          }
        }}
        onSubmit={handleCreateSubmit}
      />
      <EditUserModal
        open={isEditOpen}
        loading={updating}
        form={form}
        initialValues={editingUser || {}}
        onCancel={() => dispatch(closeEdit())}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};
export default UserList;
