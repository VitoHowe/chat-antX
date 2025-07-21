/**
 * API服务层
 * 封装所有API请求，统一处理错误和响应
 */

import { API_CONFIG } from "../config/api";
import httpService, { type ApiResponse } from "./http.service";

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
 * API服务
 */
export const ApiService = {
  /**
   * 获取模型源列表
   */
  getModelSources: async (): Promise<ModelSource[]> => {
    const response = await httpService.get<ModelSource[]>(
      API_CONFIG.baseModelSourcesURL
      // requireAuth 默认为 true，需要 token 验证
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
    const response = await httpService.get<ModelListData>(url);
    
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
    const response = await httpService.post(
      API_CONFIG.baseURL,
      {
        model,
        messages,
        stream: true,
      }
      // requireAuth 默认为 true，需要 token 验证
    );
    
    return response;
  },
};

export default ApiService;
