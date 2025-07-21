/**
 * Redux Store 类型定义
 * 包含应用中所有Redux相关的类型
 */

import { User } from '../services/auth.service';

// 认证状态接口
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// 应用设置状态接口（可扩展）
export interface SettingsState {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
}

// 根状态接口
export interface RootState {
  auth: AuthState;
  settings: SettingsState;
}

// Redux Action 类型
export interface LoginAction {
  type: string;
  payload: User;
}

export interface LogoutAction {
  type: string;
}

export interface SetLoadingAction {
  type: string;
  payload: boolean;
}

export interface SetErrorAction {
  type: string;
  payload: string | null;
} 