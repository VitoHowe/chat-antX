# Chat AntX - 基于 Ant Design X 的聊天应用

这是一个使用 Ant Design X 组件库构建的现代化聊天应用界面。

## 🚀 项目特性

- **现代化 UI**：基于 Ant Design X 最新组件
- **响应式设计**：支持 LTR/RTL 布局切换
- **组件化架构**：使用 React + TypeScript
- **按需引入**：优化打包体积，只加载使用的组件
- **开发友好**：完整的 TypeScript 支持

## 📦 技术栈

- **框架**: [Umi](https://umijs.org/) - 企业级前端应用框架
- **UI 组件**:
  - [Ant Design X](https://x.ant.design/) - 专为 AI 应用设计的组件库
  - [Ant Design](https://ant.design/) - 企业级 UI 设计语言
- **开发语言**: TypeScript
- **包管理器**: pnpm

## 🛠️ 安装与使用

### 环境要求

- Node.js >= 16
- pnpm >= 7

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

## 📁 项目结构

```
chat-antX/
├── src/
│   ├── components/          # 组件目录
│   │   └── ProductList.tsx  # 主要聊天界面组件
│   └── pages/              # 页面目录
├── .umirc.ts               # Umi 配置文件
├── package.json            # 项目依赖配置
└── README.md              # 项目说明文档
```

## 🔧 核心组件功能

### ProductList 组件

位置：`src/components/ProductList.tsx`

**功能说明：**

- **对话列表**：左侧显示多个对话会话
- **聊天气泡**：支持用户和系统消息的气泡显示
- **快捷提示**：提供预设的对话启动器
- **智能建议**：输入"/"触发命令建议
- **布局切换**：支持 LTR（从左到右）和 RTL（从右到左）布局

**主要参数：**

- `direction`: 布局方向（'ltr' | 'rtl'）
- `value`: 当前输入值
- `items`: 对话列表数据

## ⚙️ 配置说明

### Umi 配置 (.umirc.ts)

```typescript
export default defineConfig({
  // 路由配置
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
    { path: "/products", component: "products" },
  ],

  // 包管理器
  npmClient: "pnpm",

  // Ant Design 按需引入配置
  plugins: ["@umijs/plugins/dist/antd"],
  antd: {
    // Ant Design 5.x 默认支持按需引入，无需配置 import
    style: "css", // 自动引入样式
    configProvider: {}, // 主题配置
  },
});
```

### 按需引入优势

- **自动按需引入**：Ant Design 5.x 默认支持 Tree Shaking，自动移除未使用的代码
- **零配置优化**：无需手动配置，开箱即用
- **减少打包体积**：只打包实际使用的组件
- **提升加载速度**：减少不必要的资源加载
- **自动化处理**：无需手动引入样式文件

## 🎨 样式与主题

项目支持 Ant Design 的主题定制功能，可以通过修改 `.umirc.ts` 中的 `antd.configProvider` 配置来自定义主题。

**Ant Design 5.x 的优势：**

- **CSS-in-JS**：动态主题切换
- **设计令牌**：更灵活的主题定制
- **性能优化**：更小的运行时体积

## 🚨 常见问题

### 1. 依赖安装问题

如果遇到依赖安装失败，请尝试：

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 2. TypeScript 类型错误

确保安装了所有必要的类型定义：

```bash
pnpm add -D @types/react @types/react-dom
```

### 3. 组件按需引入不生效

检查 `.umirc.ts` 中是否正确配置了 antd 插件。

## 📝 开发日志

### v1.0.0 (2025-06-30)

- ✅ 初始化项目结构
- ✅ 集成 Ant Design X 组件库
- ✅ 配置按需引入
- ✅ 实现聊天界面基础功能
- ✅ 添加 TypeScript 支持
- ✅ 完善项目文档

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

💡 **提示**：如果你是编程初学者，建议先熟悉 React 和 TypeScript 的基础概念，这将帮助你更好地理解和修改代码。
