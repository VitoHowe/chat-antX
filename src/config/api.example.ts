/*
 * @Description: 
 * @Version: 2.0
 * @Autor: MyStery
 * @Date: 2025-07-09 21:54:07
 * @LastEditors: MyStery
 * @LastEditTime: 2025-07-10 00:34:37
 */
// API配置示例文件 - 可以提交到版本控制系统
// 使用时，请复制此文件为 api.ts 并填入实际的API密钥

import { BASE_API_URL } from './env';
import { ApiConfigType } from './api';

// API配置
export const API_CONFIG: ApiConfigType = {
  // API基础URL - AI服务
  baseURL: `${BASE_API_URL}/chat/completions`,
  
  // 模型列表API - 后端服务
  baseModelURL: `${BASE_API_URL}/models`,
  
  // 模型源列表API - 后端服务
  baseModelSourcesURL: `${BASE_API_URL}/model-sources`,

};

export default API_CONFIG; 