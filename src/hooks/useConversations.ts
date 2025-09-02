/**
 * 对话管理自定义Hook
 * 封装对话的增删改查逻辑，集成后端API
 * 专注于对话管理，不处理消息内容
 */

import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import type { ConversationItem, EditingConversation, Message } from '@/types';
import { ConversationService } from '@/services/conversation.service';

export const useConversations = () => {
  // 对话列表状态
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  // 当前活跃的对话ID
  const [activeConversationKey, setActiveConversationKey] = useState<string | null>(null);
  // 编辑中的对话
  const [editingConversation, setEditingConversation] = useState<EditingConversation | null>(null);
  // 编辑对话模态框显示状态
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);

  // 初始化对话列表
  const initializeConversations = useCallback(async () => {
    setLoading(true);
    try {
      // 获取用户对话数据
      const { conversations: userConversations, activeConversationKey: activeKey } = 
        await ConversationService.getConversationsData();

      if (userConversations.length > 0) {
        // 如果有对话数据，使用它们
        setConversations(userConversations);
        setActiveConversationKey(activeKey);
      } else {
        // 如果没有对话数据，创建一个默认对话
        const { conversations: defaultConversations, activeConversationKey: defaultKey } = 
          await ConversationService.createDefaultConversation();
        
        setConversations(defaultConversations);
        setActiveConversationKey(defaultKey);
      }
    } catch (error) {
      console.error('初始化对话列表失败:', error);
      message.error('加载对话列表失败，请刷新重试');
      
      // 如果API调用失败，使用本地默认数据
      const defaultKey = Date.now().toString();
      const defaultConversations: ConversationItem[] = [
        {
          key: defaultKey,
          label: '新对话',
          icon: null,
          timestamp: Date.now(),
        },
      ];
      
      setConversations(defaultConversations);
      setActiveConversationKey(defaultKey);
    } finally {
      setLoading(false);
    }
  }, []);

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
      message.warning("至少保留一个对话");
      return false;
    }

    const success = await ConversationService.deleteConversation(conversationKey);
    
    if (success) {
      // 更新本地状态
      const newConversations = conversations.filter(item => item.key !== conversationKey);
      setConversations(newConversations);
      
      // 如果删除的是当前活跃的对话，则切换到第一个对话
      if (conversationKey === activeConversationKey && newConversations.length > 0) {
        setActiveConversationKey(newConversations[0].key);
      }
      
      message.success("对话已删除");
      return true;
    } else {
      message.error("删除失败，请稍后重试");
      return false;
    }
  }, [conversations, activeConversationKey]);

  // 切换当前对话
  const changeConversation = useCallback(async (conversationKey: string, callback?: (success: boolean) => void) => {
    if (conversationKey !== activeConversationKey) {
      setActiveConversationKey(conversationKey);
      
      if (callback) {
        callback(true);
      }
    } else {
      // 如果是同一个对话，直接调用callback
      if (callback) {
        callback(true);
      }
    }
  }, [activeConversationKey]);

  // 更新编辑中的对话标题
  const updateEditingLabel = useCallback((newLabel: string) => {
    if (editingConversation) {
      setEditingConversation({
        ...editingConversation,
        label: newLabel,
      });
    }
  }, [editingConversation]);

  // 保存当前对话的消息记录
  const saveConversationMessages = useCallback(async (messages: Array<{ message: { role: string; content: string } }>) => {
    if (!activeConversationKey || messages.length === 0) return;

    try {
      // 将消息转换为API需要的格式
      const messageData = messages.map(({ message }) => ({
        role: message.role,
        content: message.content,
      }));

      const success = await ConversationService.updateConversationMessages(
        activeConversationKey,
        messageData
      );

      if (!success) {
        console.error('保存对话消息失败');
        message.warning('消息保存失败，请检查网络连接');
      }
    } catch (error) {
      console.error('保存对话消息时发生错误:', error);
      message.warning('消息保存失败，请检查网络连接');
    }
  }, [activeConversationKey]);

  // 获取指定对话的历史消息
  const getConversationMessages = useCallback(async (conversationKey: string) => {
    try {
      const historyMessages = await ConversationService.getConversationMessages(conversationKey);
      return historyMessages || [];
    } catch (error) {
      console.error('获取对话历史记录失败:', error);
      return [];
    }
  }, []);

  return {
    conversations,
    activeConversationKey,
    editingConversation,
    isEditModalVisible,
    loading,
    createConversation,
    startEditConversation,
    saveEditConversation,
    cancelEditConversation,
    deleteConversation,
    changeConversation,
    updateEditingLabel,
    saveConversationMessages,
    getConversationMessages,
  };
}; 