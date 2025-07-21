/**
 * 认证状态 Redux Slice
 * 管理用户登录、退出等状态
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../types';
import { UserInfo, User } from '../../services/auth.service';

// 初始状态
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// 创建认证slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 开始登录
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // 登录成功
    loginSuccess: (state, action: PayloadAction<UserInfo>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    
    // 登录失败
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    
    // 退出登录
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    
    // 从持久化存储恢复状态
    restoreAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
  },
});

// 导出actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  restoreAuth,
} = authSlice.actions;

// 选择器
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// 导出reducer
export default authSlice.reducer; 