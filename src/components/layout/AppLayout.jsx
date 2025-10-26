import React from "react";
import { Layout, Button as AntdButton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { LogoutOutlined } from "@ant-design/icons";
import Button from "../common/Button";

const { Header, Content } = Layout;

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useSelector((state) => state.auth);
  
  // Always store email in localStorage when available
  React.useEffect(() => {
    if (email) {
      localStorage.setItem('userEmail', email);
    }
  }, [email]);

  // Get email from localStorage or use default
  const storedEmail = localStorage.getItem('userEmail');
  const username = email || storedEmail || "User";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Header
        style={{
          background: "#001628",
          display: "flex",
          alignItems: "center",
          // justifyContent: "space-between",
          justifyContent: "end",
          padding: "0px 32px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          
        }}
      >
        {/* <div style={{ color: "#fff", fontWeight: 600 }}>User Management</div> */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#FFFFFF" , fontWeight: 600}}>{username}</span>
          <Button
            type="primary"
            danger
            size="small"
            shape="circle"
            block={false}
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            aria-label="Logout"
            style={{ borderRadius: "0px" }}
          />
        </div>
      </Header>
      <Content style={{ padding: 24 }}>{children}</Content>
    </Layout>
  );
};

export default AppLayout;
