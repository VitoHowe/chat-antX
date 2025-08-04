/**
 * 对话管理自定义Hook
 * 封装对话的增删改查逻辑，集成后端API
 * 每个对话作为独立的用户数据记录管理
 */

import { useState, useCallback, useEffect, createElement } from 'react';
import { message } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import type { ConversationItem, EditingConversation } from '@/types';
import { ConversationService } from '@/services/conversation.service';

export const useConversations = () => {
  // 对话列表状态
  const [conversations, setConversations] = useState<ConversationItem[]>([]);

  // 当前活跃对话（本地状态管理）
  const [activeConversationKey, setActiveConversationKey] = useState<string | null>(null);

  // 编辑对话状态
  const [editingConversation, setEditingConversation] = useState<EditingConversation | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  // 初始化对话数据
  const initializeConversations = useCallback(async () => {
    if (initialized) return;

    setLoading(true);
    try {
      const data = await ConversationService.getConversationsData();
      
      if (data.conversations.length === 0) {
        // 如果没有对话数据，创建默认对话
        const defaultData = await ConversationService.createDefaultConversation();
        setConversations(defaultData.conversations);
        setActiveConversationKey(defaultData.activeConversationKey);
        message.success('欢迎使用！已为您创建第一个对话');
      } else {
        // 使用后端数据
        setConversations(data.conversations);
        setActiveConversationKey(data.activeConversationKey);
      }
      
      setInitialized(true);
    } catch (error) {
      console.error('初始化对话数据失败:', error);
      message.error('加载对话数据失败');
      
      // 失败时使用本地默认数据
      const defaultKey = Date.now().toString();
      const defaultConversations: ConversationItem[] = [
        {
          key: defaultKey,
          label: '新对话',
          icon: createElement(MessageOutlined),
          timestamp: Date.now(),
        },
      ];
      setConversations(defaultConversations);
      setActiveConversationKey(defaultKey);
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  // 页面初始化时自动加载对话数据
  useEffect(() => {
    initializeConversations();
  }, [initializeConversations]);

  // 创建新对话
  const createConversation = useCallback(async () => {
    const label = `新对话${conversations.length + 1}`;
    
    const result = await ConversationService.createConversation(label);
    
    if (result.success && result.conversation) {
      const newConversations = [result.conversation, ...conversations];
      setConversations(newConversations);
      setActiveConversationKey(result.conversation.key);
      message.success("新对话创建成功");
    } else {
      message.error("创建对话失败，请稍后重试");
    }
  }, [conversations]);

  // 开始编辑对话
  const startEditConversation = useCallback((conversation: ConversationItem) => {
    setEditingConversation({
      key: conversation.key,
      label: typeof conversation.label === 'string' ? conversation.label : '新对话',
    });
    setIsEditModalVisible(true);
  }, []);

  // 保存编辑的对话
  const saveEditConversation = useCallback(async () => {
    if (!editingConversation) return;
    
    const success = await ConversationService.updateConversationLabel(
      editingConversation.key,
      editingConversation.label
    );
    
    if (success) {
      // 更新本地状态
      const newConversations = conversations.map(item =>
        item.key === editingConversation.key
          ? { ...item, label: editingConversation.label }
          : item
      );
      setConversations(newConversations);
      
      setIsEditModalVisible(false);
      setEditingConversation(null);
      message.success("对话标题修改成功");
    } else {
      message.error("修改失败，请稍后重试");
    }
  }, [editingConversation, conversations]);

  // 取消编辑对话
  const cancelEditConversation = useCallback(() => {
    setIsEditModalVisible(false);
    setEditingConversation(null);
  }, []);

  // 删除对话
  const deleteConversation = useCallback(async (conversationKey: string) => {
    // 如果只有一个对话，不允许删除
    if (conversations.length <= 1) {
      message.warning("至少需要保留一个对话");
      return;
    }

    const success = await ConversationService.deleteConversation(conversationKey);
    
    if (success) {
      const newConversations = conversations.filter(item => item.key !== conversationKey);
      setConversations(newConversations);
      
      // 如果删除的是当前选中的对话，切换到第一个对话
      if (activeConversationKey === conversationKey) {
        const newActiveKey = newConversations.length > 0 ? newConversations[0].key : null;
        setActiveConversationKey(newActiveKey);
      }
      
      message.success("对话删除成功");
    } else {
      message.error("删除失败，请稍后重试");
    }
  }, [conversations, activeConversationKey]);

  // 切换对话（仅本地状态）
  const changeConversation = useCallback((key: string) => {
    setActiveConversationKey(key);
    console.log('切换对话', key);
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
    loading,
    
    // 操作方法
    createConversation,
    startEditConversation,
    saveEditConversation,
    cancelEditConversation,
    deleteConversation,
    changeConversation,
    updateEditingLabel,
    
    // 初始化方法（通常不需要手动调用）
    initializeConversations,
  };
}; 