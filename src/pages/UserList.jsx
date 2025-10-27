import { Form as AForm, Table } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../features/user/userSlice";
import { useMobile } from "../hooks/useMobile";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { useInitialUsersFetch } from "../hooks/useInitialUsersFetch";
import { useUserSearchFilter } from "../hooks/useUserSearchFilter";
import { getUserColumns } from "../features/user/UserList/columns";
import { getTableComponents } from "../features/user/UserList/columns/tableComponents";
import { UserGrid } from "../features/user/UserList/components/UserGrid";
import { UserToolbar } from "../features/user/UserList/components/UserToolbar";
import { CreateUserModal } from "../features/user/UserList/components/CreateUserModal";
import { EditUserModal } from "../features/user/UserList/components/EditUserModal";
import {
  openCreate,
  closeCreate,
  openEdit,
  closeEdit,
  setViewMode,
} from "../features/user/userUiSlice";
import { useMessage } from "../components/common/Message";

const UserList = () => {
  const dispatch = useDispatch();
  const { data, loading, pagination } = useSelector((state) => state.users);
  const { viewMode, isCreateOpen, isEditOpen, editingUser } = useSelector(
    (state) => state.userUi
  );
  const { showMessage } = useMessage();

  const [form] = AForm.useForm();
  const [createForm] = AForm.useForm();
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { search, setSearch, filteredData } = useUserSearchFilter(data);
  const isMobile = useMobile();

  useAuthRedirect();
  useInitialUsersFetch();

  const onEdit = useCallback(
    (record) => dispatch(openEdit(record)),
    [dispatch]
  );
  const onDelete = useCallback(
    (record) => dispatch(deleteUser({ id: record.id })),
    [dispatch]
  );

  const handleCreateSubmit = useCallback(
    async (values) => {
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
        showMessage("success", "User created");
        dispatch(closeCreate());
        createForm.resetFields();
      } else {
        showMessage("error", "Failed to create user");
      }
    },
    [dispatch, createForm]
  );

  const handleEditSubmit = useCallback(
    async (values) => {
      if (!editingUser) return;
      setUpdating(true);
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
        showMessage("success", "User updated");
        dispatch(closeEdit());
      } else {
        showMessage("error", "Failed to update user");
      }
      setUpdating(false);
    },
    [dispatch, editingUser, showMessage]
  );

  const columnsMemo = useMemo(
    () => getUserColumns({ isMobile, onEdit, onDelete }),
    [isMobile, onEdit, onDelete]
  );
  const tableComponents = useMemo(
    () => getTableComponents({ isMobile }),
    [isMobile]
  );

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
