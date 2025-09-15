/*
 * @Description: 
 * @Version: 2.0
 * @Autor: MyStery
 * @Date: 2025-09-02 16:22:07
 * @LastEditors: MyStery
 * @LastEditTime: 2025-09-15 14:54:34
 */
/**
 * 项目通用类型定义
 */

import { ReactNode } from 'react';

// 思维链项类型
export interface ThinkItem {
  title?: string;
  description?: string;
  content: string;
}

// 消息类型
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  /** 是否为历史消息，历史消息不显示打字器效果 */
  isHistorical?: boolean;
  /** 思维链内容，仅assistant角色可能有 */
  think?: ThinkItem[];
}

// 对话项类型
export interface ConversationItem {
  key: string;
  label: string;
  icon: ReactNode;
  timestamp: number;
}

// 编辑对话状态类型
export interface EditingConversation {
  key: string;
  label: string;
}

// 模型选项类型
export interface ModelOption {
  value: string;
  label: string;
}

// 模型源类型
export interface ModelSource {
  type: string;
  name: string;
}

// 模型类型
export interface Model {
  id: string;
  name?: string;
}

// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
}

// 认证状态类型
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// API响应基础类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 聊天请求类型
export interface ChatRequest {
  stream: boolean;
  message: Message;
}

// 聊天响应类型
export interface ChatResponse {
  id: string;
  message: Message;
}

// 组件Props基础类型
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
} 