/**
 * 对话管理自定义Hook
 * 封装对话的增删改查逻辑
 */

import { useState, useCallback, createElement } from 'react';
import { message } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import type { ConversationItem, EditingConversation } from '@/types';

export const useConversations = () => {
  // 对话列表状态
  const [conversations, setConversations] = useState<ConversationItem[]>([
    {
      key: "1",
      label: "新对话",
      icon: createElement(MessageOutlined),
      timestamp: Date.now(),
    },
  ]);

  // 当前活跃对话
  const [activeConversationKey, setActiveConversationKey] = useState<string>("1");

  // 编辑对话状态
  const [editingConversation, setEditingConversation] = useState<EditingConversation | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  // 创建新对话
  const createConversation = useCallback(() => {
    const newKey = Date.now().toString();
    const newConversation: ConversationItem = {
      key: newKey,
      label: `新对话 ${conversations.length + 1}`,
      icon: createElement(MessageOutlined),
      timestamp: Date.now(),
    };
    
    setConversations(prev => [...prev, newConversation]);
    setActiveConversationKey(newKey);
    message.success("新对话创建成功");
  }, [conversations.length]);

  // 开始编辑对话
  const startEditConversation = useCallback((conversation: ConversationItem) => {
    setEditingConversation({
      key: conversation.key,
      label: typeof conversation.label === 'string' ? conversation.label : '新对话',
    });
    setIsEditModalVisible(true);
  }, []);

  // 保存编辑的对话
  const saveEditConversation = useCallback(() => {
    if (!editingConversation) return;
    
    setConversations(prev =>
      prev.map(item =>
        item.key === editingConversation.key
          ? { ...item, label: editingConversation.label }
          : item
      )
    );
    
    setIsEditModalVisible(false);
    setEditingConversation(null);
    message.success("对话标题修改成功");
  }, [editingConversation]);

  // 取消编辑对话
  const cancelEditConversation = useCallback(() => {
    setIsEditModalVisible(false);
    setEditingConversation(null);
  }, []);

  // 删除对话
  const deleteConversation = useCallback((conversationKey: string) => {
    // 如果只有一个对话，不允许删除
    if (conversations.length <= 1) {
      message.warning("至少需要保留一个对话");
      return;
    }

    setConversations(prev => prev.filter(item => item.key !== conversationKey));
    
    // 如果删除的是当前选中的对话，切换到第一个对话
    if (activeConversationKey === conversationKey) {
      const remainingConversations = conversations.filter(item => item.key !== conversationKey);
      if (remainingConversations.length > 0) {
        setActiveConversationKey(remainingConversations[0].key);
      }
    }
    
    message.success("对话删除成功");
  }, [conversations, activeConversationKey]);

  // 切换对话
  const changeConversation = useCallback((key: string) => {
    setActiveConversationKey(key);
  }, []);

  // 更新编辑中的对话标题
  const updateEditingLabel = useCallback((label: string) => {
    setEditingConversation(prev => 
      prev ? { ...prev, label } : null
    );
  }, []);

  return {
    // 状态
    conversations,
    activeConversationKey,
    editingConversation,
    isEditModalVisible,
    
    // 操作方法
    createConversation,
    startEditConversation,
    saveEditConversation,
    cancelEditConversation,
    deleteConversation,
    changeConversation,
    updateEditingLabel,
  };
}; 