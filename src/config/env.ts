/**
 * 环境配置示例文件
 * 复制此文件为env.ts并根据实际环境修改
 */

// 判断当前环境
const isDevelopment = process.env.NODE_ENV === 'development';

// 基础API地址 - 根据实际情况修改
export const BASE_API_URL = isDevelopment 
  ? 'https://chat.mnnu.net.cn'  // 开发环境地址
  : 'https://chat.mnnu.net.cn';  // 生产环境地址


// 环境名称
export const ENV_NAME = isDevelopment ? 'development' : 'production';

// 导出环境配置
export const ENV_CONFIG = {
  isDevelopment,
  BASE_API_URL,
  ENV_NAME,
};

export default ENV_CONFIG; 