import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Checkbox from "../components/common/Checkbox";
import Form from "../components/common/Form";
import Input from "../components/common/Input";
import { useMessage } from "../components/common/Message";
import { clearError, login } from "../features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [remembered, setRemembered] = useState({});
  const { loading, error } = useSelector((state) => state.auth);
  const { showMessage } = useMessage();

  const onFinish = async (values) => {
    const result = await dispatch(
      login({ email: values.email, password: values.password })
    );
    if (login.fulfilled.match(result)) {
      if (values.remember) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({ email: values.email, remember: true })
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }
      navigate("/users");
    }
  };



  useEffect(() => {
    if (error) {
      showMessage("error", error);
      dispatch(clearError());
    }
  }, [error, dispatch, showMessage]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rememberedUser");
      setRemembered(stored ? JSON.parse(stored) : {});
    } catch {
      setRemembered({});
    }
  }, []);


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#DEDEDE",
      }}
    >
      <Card>
        <Form
          name="login"
          initialValues={{
            email: remembered.email || "",
            password: "",
            remember: !!remembered.remember,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input type="text" prefix="user" placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input type="password" prefix="lock" placeholder="Password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
