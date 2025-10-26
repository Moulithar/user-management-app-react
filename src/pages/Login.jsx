import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../features/auth/authSlice";
import { message } from "antd";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Checkbox from "../components/common/Checkbox";
import Form from "../components/common/Form";
import Input from "../components/common/Input";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (token) navigate('/users');
//   }, [token, navigate]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onFinish = async (values) => {
    const result = await dispatch(login({ email: values.email, password: values.password }));
    if (login.fulfilled.match(result)) {
      if (values.remember) {
        localStorage.setItem('rememberedUser', JSON.stringify({ email: values.email, remember: true }));
      } else {
        localStorage.removeItem('rememberedUser');
      }
      navigate('/users');
    }
  };

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
        //   initialValues={{
        //     email: "eve.holt@reqres.in",
        //     password: "cityslicka",
        //   }}
          initialValues={{
            email: "",
            password: "",
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
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
