/*
 * @Description:
 * @Version: 2.0
 * @Autor: MyStery
 * @Date: 2025-06-30 21:54:00
 * @LastEditors: MyStery
 * @LastEditTime: 2025-07-14 21:18:31
 */
import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
    { path: "/products", component: "products" },
    { path: "/auth", component: "auth" },
  ],
  npmClient: "pnpm",
  plugins: ["@umijs/plugins/dist/antd"],
  antd: {
    // Ant Design 5.x 默认支持按需引入，无需配置 import
    // 自动引入样式
    style: "css",
    // 启用antd的主题配置
    configProvider: {},
  },
});
