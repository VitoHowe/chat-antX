/**
 * 对话数据API服务
 * 封装对话数据的后端API调用逻辑
 * 每个对话作为独立的用户数据记录存储
 */

import { API_CONFIG } from '@/config/api';
import httpService, { type ApiResponse } from './http.service';
import type { ConversationItem } from '@/types';
import { createElement } from 'react';
import { MessageOutlined } from '@ant-design/icons';

// 用户数据API响应类型
export interface UserDataResponse {
  id: number;
  user_id: number;
  field_name: string;
  data: any;
  created_at: string;
  updated_at: string;
}

// 创建用户数据请求类型
export interface CreateUserDataRequest {
  key: string;                 // 数据记录唯一标识
  field_name: string;          // 字段名称
  data: any;                   // JSON数据内容
}

// 更新用户数据请求类型
export interface UpdateUserDataRequest {
  field_name?: string;
  data?: any;
}

/**
 * 对话数据API服务
 */
export const ConversationService = {
  /**
   * 获取用户的所有对话数据
   */
  async getConversationsData(): Promise<{
    conversations: ConversationItem[];
    activeConversationKey: string | null;
  }> {
    try {
      const response = await httpService.get<UserDataResponse[]>(
        API_CONFIG.userDataURL
      );

      if (response.success && response.data) {
        // 将每条用户数据记录转换为对话项
        const conversations: ConversationItem[] = response.data.map(record => ({
          key: record.id.toString(), // 确保ID是字符串
          label: record.field_name,
          icon: createElement(MessageOutlined),
          timestamp: new Date(record.created_at).getTime(),
        }));

        // 按时间排序，最新的在前
        conversations.sort((a, b) => b.timestamp - a.timestamp);

        return {
          conversations,
          activeConversationKey: conversations.length > 0 ? conversations[0].key : null,
        };
      }

      // 如果没有数据，返回空数组
      return {
        conversations: [],
        activeConversationKey: null,
      };
    } catch (error) {
      console.error('获取对话数据失败:', error);
      return {
        conversations: [],
        activeConversationKey: null,
      };
    }
  },

  /**
   * 创建新对话
   */
  async createConversation(label: string): Promise<{
    conversation: ConversationItem | null;
    success: boolean;
  }> {
    try {
      // 生成更短的唯一key
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10);
      const uniqueKey = `${timestamp}${random}`;
      
      const response = await httpService.post<{ id: string; field_name: string }>(
        API_CONFIG.userDataURL,
        {
          key: uniqueKey, // 添加唯一key值
          field_name: label,
          data: {}, // 空JSON对象
        } as CreateUserDataRequest
      );

      if (response.success && response.data) {
        // 使用API返回的ID作为key
        const newConversation: ConversationItem = {
          key: response.data.id, // API返回的ID已经是字符串
          label: label,
          icon: createElement(MessageOutlined),
          timestamp: Date.now(),
        };

        return {
          conversation: newConversation,
          success: true,
        };
      }

      return {
        conversation: null,
        success: false,
      };
    } catch (error) {
      console.error('创建对话失败:', error);
      return {
        conversation: null,
        success: false,
      };
    }
  },

  /**
   * 删除对话
   */
  async deleteConversation(conversationKey: string): Promise<boolean> {
    try {
      // conversationKey就是记录的ID
      const response = await httpService.delete(
        `${API_CONFIG.userDataURL}/${conversationKey}`
      );

      return response.success;
    } catch (error) {
      console.error('删除对话失败:', error);
      return false;
    }
  },

  /**
   * 更新对话标题
   */
  async updateConversationLabel(conversationKey: string, newLabel: string): Promise<boolean> {
    try {
      const response = await httpService.put(
        `${API_CONFIG.userDataURL}/${conversationKey}`,
        {
          field_name: newLabel,
        } as UpdateUserDataRequest
      );

      return response.success;
    } catch (error) {
      console.error('更新对话标题失败:', error);
      return false;
    }
  },

  /**
   * 创建默认对话
   */
  async createDefaultConversation(): Promise<{
    conversations: ConversationItem[];
    activeConversationKey: string;
  }> {
    const result = await this.createConversation('新对话');

    if (result.success && result.conversation) {
      return {
        conversations: [result.conversation],
        activeConversationKey: result.conversation.key,
      };
    }

    // 如果创建失败，返回本地默认数据
    const defaultKey = Date.now().toString();
    const defaultConversations: ConversationItem[] = [
      {
        key: defaultKey,
        label: '新对话',
        icon: createElement(MessageOutlined),
        timestamp: Date.now(),
      },
    ];

    return {
      conversations: defaultConversations,
      activeConversationKey: defaultKey,
    };
  },
}; 