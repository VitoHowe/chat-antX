/**
 * 认证服务层
 * 处理用户登录、注册相关API请求
 */

import { message } from "antd";
import { API_CONFIG } from "../config/api";
import { store } from "../store";
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from "../store/slices/authSlice";
import httpService, { type ApiResponse } from "./http.service";

// 用户登录请求参数
export interface LoginRequest {
  username: string;
  password: string;
}

// 用户注册请求参数
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

// 用户基础信息类型
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}

// 登录响应数据类型
export interface UserInfo {
  token: string;
  user: User;
  expiresIn?: string;
}

/**
 * 认证服务
 */
export const AuthService = {
  /**
   * 用户登录
   * @param loginData 登录数据
   * @returns 用户信息和令牌
   */
  login: async (loginData: LoginRequest): Promise<ApiResponse<UserInfo>> => {
    // 开始登录，更新Redux状态
    store.dispatch(loginStart());
    
    try {
      const response = await httpService.post<UserInfo>(
        API_CONFIG.UserLoginURL,
        loginData,
        { requireAuth: false } // 登录请求不需要 token
      );

      if (response.success && response.data?.token) {
        // 保存token到本地存储（兼容现有逻辑）
        localStorage.setItem("authToken", response.data.token);
        // 更新Redux状态 - 登录成功
        store.dispatch(loginSuccess(response.data));
        
        message.success("登录成功！");
      } else {
        // 更新Redux状态 - 登录失败
        store.dispatch(loginFailure(response.message || "登录失败"));
        // httpService 已经处理了错误消息显示，这里不需要重复显示
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "登录过程中发生未知错误";
      
      // 更新Redux状态 - 登录失败
      store.dispatch(loginFailure(errorMessage));
      
      throw error;
    }
  },

  /**
   * 用户注册
   * @param registerData 注册数据
   * @returns 注册结果
   */
  register: async (
    registerData: RegisterRequest
  ): Promise<ApiResponse<UserInfo>> => {
    const response = await httpService.post<UserInfo>(
      API_CONFIG.UserRegisterURL,
      registerData,
      { requireAuth: false } // 注册请求不需要 token
    );

    if (response.success) {
      message.success("注册成功！请登录");
    }
    // httpService 已经处理了错误消息显示

    return response;
  },

  /**
   * 退出登录
   */
  logout: () => {
    // 清除本地存储
    localStorage.removeItem("authToken");
    
    // 更新Redux状态
    store.dispatch(logoutAction());
    
    message.success("已退出登录");
  },

  /**
   * 获取存储的token
   */
  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  /**
   * 检查是否已登录
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  },
};

export default AuthService;
