/**
 * 项目通用类型定义
 */

import { ReactNode } from 'react';

// 消息类型
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
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