/**
 * 应用头部导航组件
 * 显示应用标题、用户状态和相关操作
 */

import React from 'react';
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
import { useAppSelector } from '../store';
import { selectAuth } from '../store/slices/authSlice';
import { AuthService } from '../services/auth.service';
import { history } from 'umi';

const { Header: AntHeader } = Layout;
const { Text, Title } = Typography;

const Header: React.FC = () => {
  const auth = useAppSelector(selectAuth);

  const handleLogout = () => {
    AuthService.logout();
    // 可选：跳转到登录页
    history.push('/auth');
  };

  const handleLogin = () => {
    history.push('/auth');
  };

  // 用户下拉菜单项
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '8px 0' }}>
          <div>
            <Text strong>{auth.user?.username}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {auth.user?.email}
            </Text>
          </div>
          <Divider style={{ margin: '8px 0' }} />
          <div>
            <Text type="secondary" style={{ fontSize: '11px' }}>
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
      icon: <SettingOutlined />,
      onClick: () => {
        // TODO: 实现设置页面跳转
        console.log('跳转到设置页面');
      },
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* 左侧：应用 Logo 和标题 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <RobotOutlined 
          style={{ 
            fontSize: '24px', 
            color: '#1890ff', 
            marginRight: '12px' 
          }} 
        />
        <Title 
          level={4} 
          style={{ 
            margin: 0, 
            color: '#1890ff',
            fontWeight: 600 
          }}
        >
          Chat AntX
        </Title>
      </div>

      {/* 右侧：用户状态区域 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {auth.isAuthenticated ? (
          <Space size="middle">
            {/* 状态指示器 */}
            <Space size="small">
              <Tag 
                color="green" 
                style={{ 
                  margin: 0,
                  borderRadius: '12px',
                  fontSize: '11px' 
                }}
              >
                在线
              </Tag>
              {auth.loading && (
                <Tag 
                  color="blue" 
                  style={{ 
                    margin: 0,
                    borderRadius: '12px',
                    fontSize: '11px' 
                  }}
                >
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  style={{ 
                    backgroundColor: '#1890ff',
                    marginRight: '8px' 
                  }}
                />
                <Text 
                  style={{ 
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '14px'
                  }}
                >
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
              style={{
                borderRadius: '6px',
                fontWeight: 500,
              }}
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