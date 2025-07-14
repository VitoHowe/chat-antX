/**
 * API服务层
 * 封装所有API请求，统一处理错误和响应
 */

import { API_CONFIG } from "../config/api";
import { message } from "antd";

// 通用响应类型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

// 模型列表响应的嵌套结构
interface ModelListData {
  data: Model[];
  success: boolean;
}

// 模型源类型
export interface ModelSource {
  type: number;
  name: string;
  isActive: number;
}

// 模型类型
export interface Model {
  id: string;
  root: string;
  [key: string]: any;
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
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
    console.error("API请求错误:", error);
    message.error("请求失败，请检查网络连接");
    return {
      success: false,
      message: error instanceof Error ? error.message : "未知错误",
    };
  }
};

/**
 * API服务
 */
export const ApiService = {
  /**
   * 获取模型源列表
   */
  getModelSources: async (): Promise<ModelSource[]> => {
    const response = await request<ModelSource[]>(
      API_CONFIG.baseModelSourcesURL
    );
    if (response.success && response.data) {
      return response.data.filter((source) => source.isActive === 1);
    }
    return [];
  },

  /**
   * 获取模型列表
   */
  getModels: async (sourceType: string): Promise<Model[]> => {
    const url = `${API_CONFIG.baseModelURL}?type=${sourceType}`;
    const response = await request<ModelListData>(url);
    console.log(response);

    if (response.success && response.data && response.data.data) {
      return response.data.data;
    }
    return [];
  },

  /**
   * 发送聊天请求
   * 这里只是示例，实际上聊天请求通过useXAgent和useXChat处理
   */
  sendChatRequest: async (model: string, messages: any[]): Promise<any> => {
    const response = await request(API_CONFIG.baseURL, {
      method: "POST",
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });
    return response;
  },
};

export default ApiService;
