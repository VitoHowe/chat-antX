/**
 * 通用 HTTP 客户端服务
 * 统一处理所有 API 请求、认证和错误处理
 */

import { message } from "antd";
import { history } from "umi";
import { store } from "../store";
import { logout as logoutAction } from "../store/slices/authSlice";

// 通用响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

// 请求配置接口
export interface RequestConfig extends RequestInit {
  requireAuth?: boolean; // 是否需要 token 验证，默认为 true
  showErrorMessage?: boolean; // 是否显示错误消息，默认为 true
}

/**
 * HTTP 客户端类
 */
class HttpService {
  /**
   * 获取存储的认证 token
   */
  private getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  /**
   * 清除认证状态并跳转到登录页
   */
  private handleAuthExpired(): void {
    // 清除本地存储
    localStorage.removeItem("authToken");
    
    // 更新 Redux 状态
    store.dispatch(logoutAction());
    
    // 显示提示信息
    message.error("登录已过期，请重新登录");
    
    // 跳转到登录页
    history.push("/auth");
  }

  /**
   * 处理响应错误
   */
  private handleResponseError(response: Response): void {
    if (response.status === 401) {
      this.handleAuthExpired();
    } else if (response.status >= 500) {
      message.error("服务器错误，请稍后重试");
    }
  }

  /**
   * 通用请求方法
   * @param url 请求地址
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  async request<T>(
    url: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const {
        requireAuth = true,
        showErrorMessage = true,
        headers = {},
        ...restConfig
      } = config;

      // 构建请求头
      const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(headers as Record<string, string>),
      };

      // 如果需要认证，添加 token
      if (requireAuth) {
        const token = this.getAuthToken();
        if (!token) {
          this.handleAuthExpired();
          return {
            success: false,
            message: "未找到认证令牌",
          };
        }
        requestHeaders.authorization = `Bearer ${token}`;
      }

      // 发送请求
      const response = await fetch(url, {
        headers: requestHeaders,
        ...restConfig,
      });

      // 处理HTTP错误状态
      if (!response.ok) {
        this.handleResponseError(response);
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }

      // 解析响应数据
      const data: ApiResponse<T> = await response.json();

      // 检查业务逻辑错误（API返回 success: false）
      if (!data.success) {
        // 如果是认证相关错误，处理 token 失效
        if (data.code === 401 || data.message?.includes("token") || data.message?.includes("未授权")) {
          this.handleAuthExpired();
          return data;
        }

        // 显示业务错误信息
        if (showErrorMessage && data.message) {
          message.error(data.message);
        }
      }

      return data;
    } catch (error) {
      console.error("HTTP请求错误:", error);
      
      const errorMessage = error instanceof Error ? error.message : "网络请求失败";
      
      if (config.showErrorMessage !== false) {
        message.error(errorMessage);
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * GET 请求
   */
  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  /**
   * POST 请求
   */
  async post<T>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT 请求
   */
  async put<T>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }
}

// 导出单例实例
export const httpService = new HttpService();

// 导出类型
export { HttpService };

// 默认导出
export default httpService; 