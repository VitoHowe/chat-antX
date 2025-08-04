/**
 * 对话侧边栏组件
 * 负责对话列表展示、新建对话、对话管理等功能
 */

import React from 'react';
import {
  Flex,
  Button,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { Conversations } from '@ant-design/x';
import type { ConversationItem } from '@/types';
import '@/styles/components/chat/ConversationSidebar.css';

interface ConversationSidebarProps {
  /** 对话列表数据 */
  conversations: ConversationItem[];
  /** 当前激活的对话key */
  activeConversationKey: string | null;
  /** 新建对话处理函数 */
  onCreateConversation: () => void;
  /** 切换对话处理函数 */
  onChangeConversation: (key: string) => void;
  /** 开始编辑对话处理函数 */
  onStartEditConversation: (conversation: ConversationItem) => void;
  /** 删除对话处理函数 */
  onDeleteConversation: (key: string) => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  activeConversationKey,
  onCreateConversation,
  onChangeConversation,
  onStartEditConversation,
  onDeleteConversation,
}) => {
  return (
    <Flex vertical className="conversation-sidebar">
      {/* 新建对话按钮区域 */}
      <div className="conversation-header">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateConversation}
          className="create-conversation-btn"
        >
          新建对话
        </Button>
      </div>

      {/* 对话列表 */}
      <div className="conversation-list-container">
        <Conversations
          className="conversation-list"
          styles={{
            item: {}
          }}
          classNames={{
            item: "conversation-item"
          }}
          activeKey={activeConversationKey || undefined}
          onActiveChange={onChangeConversation}
          items={conversations}
          menu={(conversation) => ({
            items: [
              {
                key: "edit",
                label: "重命名",
                icon: <EditOutlined />,
                onClick: () => {
                  const conversationItem: ConversationItem = {
                    key: conversation.key,
                    label: typeof conversation.label === 'string' ? conversation.label : '新对话',
                    icon: conversation.icon || <MessageOutlined />,
                    timestamp: (conversation as any).timestamp || Date.now(),
                  };
                  onStartEditConversation(conversationItem);
                },
              },
              {
                key: "delete",
                label: (
                  <Popconfirm
                    title="确认删除"
                    description="确定要删除这个对话吗？删除后无法恢复。"
                    onConfirm={() => onDeleteConversation(conversation.key)}
                    okText="确认"
                    cancelText="取消"
                    placement="topRight"
                  >
                    <span className="delete-conversation-text">删除对话</span>
                  </Popconfirm>
                ),
                icon: <DeleteOutlined />,
                danger: true,
              },
            ],
          })}
        />
      </div>
    </Flex>
  );
};

export default ConversationSidebar; 