/**
 * 应用头部导航组件
 * 显示应用标题、用户状态和相关操作
 */

import React, { useMemo } from 'react';
import { 
  Layout, 
  Typography, 
  Space, 
  Button, 
  Dropdown, 
  Avatar,
  Divider,
  Tag,
  MenuProps
} from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  RobotOutlined 
} from '@ant-design/icons';
import { useAppSelector } from '@/store';
import { selectAuth } from '@/store/slices/authSlice';
import { AuthService } from '@/services/auth.service';
import { history } from 'umi';
import '@/styles/components/Header.css';

const { Header: AntHeader } = Layout;
const { Text, Title } = Typography;

const Header: React.FC = () => {
  const auth = useAppSelector(selectAuth);

  const handleLogout = () => {
    AuthService.logout();
    history.push('/auth');
  };

  const handleLogin = () => {
    history.push('/auth');
  };

  // 使用 useMemo 优化用户菜单项的计算
  const userMenuItems: MenuProps['items'] = useMemo(() => [
    {
      key: 'user-info',
      label: (
        <div className="user-info-menu-item">
          <div>
            <Text strong>{auth.user?.username}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {auth.user?.email}
            </Text>
          </div>
          <Divider className="user-info-divider" />
          <div>
            <Text type="secondary" className="user-id-text">
              用户ID: {auth.user?.id}
            </Text>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      label: '设置',
      icon: <SettingOutlined className="menu-item-icon" />,
      onClick: () => {
        // TODO: 实现设置页面跳转
        console.log('跳转到设置页面');
      },
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined className="menu-item-icon" />,
      onClick: handleLogout,
      className: 'danger-menu-item',
    },
  ], [auth.user, handleLogout]);

  return (
    <AntHeader className="header-container">
      {/* 左侧：应用 Logo 和标题 */}
      <div className="header-logo-area">
        <RobotOutlined className="header-logo-icon" />
        <Title level={4} className="header-title">
          Chat AntX
        </Title>
      </div>

      {/* 右侧：用户状态区域 */}
      <div className="header-user-area">
        {auth.isAuthenticated ? (
          <Space size="middle">
            {/* 状态指示器 */}
            <Space size="small">
              <Tag className="status-tag online">
                在线
              </Tag>
              {auth.loading && (
                <Tag className="status-tag syncing">
                  同步中
                </Tag>
              )}
            </Space>
            
            {/* 用户下拉菜单 */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
              arrow={{ pointAtCenter: true }}
            >
              <div className="user-dropdown-trigger">
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  className="user-avatar"
                />
                <Text className="user-name">
                  {auth.user?.username}
                </Text>
              </div>
            </Dropdown>
          </Space>
        ) : (
          <Space size="small">
            <Button 
              type="primary" 
              icon={<UserOutlined />} 
              onClick={handleLogin}
              className="login-btn"
            >
              登录
            </Button>
          </Space>
        )}
      </div>
    </AntHeader>
  );
};

export default Header; 