/**
 * 认证页面 - 登录/注册
 * 现代化设计，支持登录和注册模式切换
 */

import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Tabs,
  Typography,
  Space,
  Divider,
  message,
} from "antd";
import type { TabsProps } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { history } from "umi";
import {
  AuthService,
  LoginRequest,
  RegisterRequest,
} from "../services/auth.service";
import "./auth.less";

const { Title, Text } = Typography;

/**
 * 认证页面主组件
 */
const AuthPage: React.FC = () => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  /**
   * 处理登录提交
   */
  const handleLogin = async (values: LoginRequest) => {
    setLoginLoading(true);
    try {
      const response = await AuthService.login(values);
      if (response.success) {
        // 登录成功，跳转到主页
        history.push("/");
      }
    } catch (error) {
      console.error("登录错误:", error);
    } finally {
      setLoginLoading(false);
    }
  };

  /**
   * 处理注册提交
   */
  const handleRegister = async (values: RegisterRequest) => {
    setRegisterLoading(true);
    try {
      const response = await AuthService.register(values);
      if (response.success) {
        // 注册成功，切换到登录tab
        setActiveTab("login");
        registerForm.resetFields();
      }
    } catch (error) {
      console.error("注册错误:", error);
    } finally {
      setRegisterLoading(false);
    }
  };

  /**
   * 登录表单
   */
  const LoginForm = () => (
    <Form
      form={loginForm}
      name="login"
      onFinish={handleLogin}
      size="large"
      layout="vertical"
    >
      <Form.Item
        name="username"
        rules={[
          { required: true, message: "请输入用户名!" },
          { min: 3, message: "用户名至少3个字符!" },
        ]}
      >
        <Input
          prefix={<UserOutlined className="auth-input-icon" />}
          placeholder="用户名"
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: "请输入密码!" },
          { min: 6, message: "密码至少6个字符!" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="auth-input-icon" />}
          placeholder="密码"
          className="auth-input"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loginLoading}
          className="auth-submit-btn"
          block
        >
          {loginLoading ? "登录中..." : "登录"}
        </Button>
      </Form.Item>
    </Form>
  );

  /**
   * 注册表单
   */
  const RegisterForm = () => (
    <Form
      form={registerForm}
      name="register"
      onFinish={handleRegister}
      size="large"
      layout="vertical"
    >
      <Form.Item
        name="username"
        rules={[
          { required: true, message: "请输入用户名!" },
          { min: 3, message: "用户名至少3个字符!" },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "用户名只能包含字母、数字和下划线!",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="auth-input-icon" />}
          placeholder="用户名"
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: "请输入邮箱!" },
          { type: "email", message: "请输入有效的邮箱格式!" },
        ]}
      >
        <Input
          prefix={<MailOutlined className="auth-input-icon" />}
          placeholder="邮箱"
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: "请输入密码!" },
          { min: 6, message: "密码至少6个字符!" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="auth-input-icon" />}
          placeholder="密码"
          className="auth-input"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "请确认密码!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("两次输入的密码不一致!"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="auth-input-icon" />}
          placeholder="确认密码"
          className="auth-input"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={registerLoading}
          className="auth-submit-btn"
          block
        >
          {registerLoading ? "注册中..." : "注册"}
        </Button>
      </Form.Item>
    </Form>
  );

  // 定义Tabs的items配置
  const tabItems: TabsProps['items'] = [
    {
      key: 'login',
      label: '登录',
      children: <LoginForm />,
    },
    {
      key: 'register',
      label: '注册',
      children: <RegisterForm />,
    },
  ];

  return (
    <div className="auth-container">
      {/* 背景装饰 */}
      <div className="auth-background">
        <div className="auth-bg-shape auth-bg-shape-1"></div>
        <div className="auth-bg-shape auth-bg-shape-2"></div>
        <div className="auth-bg-shape auth-bg-shape-3"></div>
      </div>

      {/* 主要内容 */}
      <div className="auth-content">
        <Card className="auth-card" bordered={false}>
          {/* 头部标题 */}
          <div className="auth-header">
            <Title level={2} className="auth-title">
              Chat AntX
            </Title>
            <Text className="auth-subtitle">
              {activeTab === "login" ? "欢迎回来" : "加入我们"}
            </Text>
          </div>

          {/* 表单内容 */}
          <div className="auth-form-container">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              centered
              className="auth-tabs"
              size="large"
              items={tabItems}
            />
          </div>

          {/* 底部提示 */}
          <div className="auth-footer">
            <Divider>
              <Text type="secondary" className="auth-footer-text">
                开始您的智能对话之旅
              </Text>
            </Divider>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
