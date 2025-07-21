/**
 * API配置类型定义
 * 定义所有API相关的配置接口
 */

// API配置类型
export interface ApiConfigType {
  // AI聊天服务相关API
  baseURL: string;              // 聊天完成API端点
  baseModelURL: string;         // 模型列表API端点
  baseModelSourcesURL: string;  // 模型源列表API端点
  
  // 用户认证相关API
  UserLoginURL: string;        // 用户登录API端点
  UserRegisterURL: string;     // 用户注册API端点
} 