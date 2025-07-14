/**
 * 认证服务层
 * 处理用户登录、注册相关API请求
 */

import { message } from "antd";
import { API_CONFIG } from "../config/api";

// 通用响应类型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

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

// 用户信息类型
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  token?: string;
}

/**
 * 通用请求方法
 */
const request = async <T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  try {
    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    const response = await fetch(url, defaultOptions);

    // 处理非200响应
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("认证API请求错误:", error);
    message.error("请求失败，请检查网络连接");
    return {
      success: false,
      message: error instanceof Error ? error.message : "未知错误",
    };
  }
};

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
    const response = await request<UserInfo>(API_CONFIG.UserLoginURL, {
      method: "POST",
      body: JSON.stringify(loginData),
    });

    if (response.success && response.data?.token) {
      // 保存token到本地存储
      localStorage.setItem("authToken", response.data.token);
      message.success("登录成功！");
    } else {
      message.error(response.message || "登录失败");
    }

    return response;
  },

  /**
   * 用户注册
   * @param registerData 注册数据
   * @returns 注册结果
   */
  register: async (
    registerData: RegisterRequest
  ): Promise<ApiResponse<UserInfo>> => {
    const response = await request<UserInfo>(API_CONFIG.UserRegisterURL, {
      method: "POST",
      body: JSON.stringify(registerData),
    });

    if (response.success) {
      message.success("注册成功！请登录");
    } else {
      message.error(response.message || "注册失败");
    }

    return response;
  },

  /**
   * 退出登录
   */
  logout: () => {
    localStorage.removeItem("authToken");
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
