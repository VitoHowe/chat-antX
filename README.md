# Chat AntX - 基于 Ant Design X 的聊天应用

这是一个使用 Ant Design X 组件库构建的现代化聊天应用界面。

## 🚀 项目特性

- **现代化 UI**：基于 Ant Design X 最新组件
- **用户认证**：完整的登录/注册系统，现代化 UI 设计
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
│   ├── pages/              # 页面目录
│   │   ├── auth.tsx        # 登录/注册页面
│   │   ├── auth.less       # 认证页面样式
│   │   └── ...
│   └── services/           # 服务目录
│       ├── api.service.ts  # API服务封装
│       └── auth.service.ts # 认证服务
├── .umirc.ts               # Umi 配置文件
├── package.json            # 项目依赖配置
└── README.md              # 项目说明文档
```

## 🔧 核心功能

### 用户认证系统

#### 登录/注册页面 (`/auth`)

**功能特性：**

- **现代化 UI 设计**：采用渐变背景、卡片式设计、流畅动画
- **双模式切换**：登录和注册模式无缝切换
- **表单验证**：完整的前端表单验证机制
- **响应式布局**：适配移动设备和桌面端
- **用户体验优化**：加载状态、错误提示、成功反馈

**登录功能：**

- 用户名输入（最少 3 个字符）
- 密码输入（最少 6 个字符）
- API 接口：`POST /login`

**注册功能：**

- 用户名输入（字母、数字、下划线）
- 邮箱验证（标准邮箱格式）
- 密码输入（最少 6 个字符）
- 密码确认（一致性验证）
- API 接口：`POST /register`

**技术实现：**

- **表单管理**：使用 Ant Design Form 组件
- **状态管理**：React Hooks (useState)
- **路由跳转**：Umi history 对象
- **本地存储**：JWT token 自动保存
- **API 集成**：统一的错误处理和响应管理

#### 认证服务 (`AuthService`)

**功能说明：**

- **login()**：用户登录，自动保存 token
- **register()**：用户注册，成功后引导登录
- **logout()**：清除本地 token，退出登录
- **getToken()**：获取存储的认证 token
- **isAuthenticated()**：检查用户登录状态

**数据类型：**

```typescript
// 登录请求参数
interface LoginRequest {
  username: string;
  password: string;
}

// 注册请求参数
interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

// 用户信息
interface UserInfo {
  id: string;
  username: string;
  email: string;
  token?: string;
}
```

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
    { path: "/auth", component: "auth" }, // 新增认证页面
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

## 🎨 UI 设计特点

### 现代化认证页面

**视觉特色：**

- **渐变背景**：多色彩渐变，营造科技感
- **玻璃态效果**：毛玻璃背景模糊，层次分明
- **浮动动画**：背景装饰元素的漂浮动画
- **卡片设计**：圆角阴影，悬停效果
- **流畅过渡**：所有交互都有平滑动画

**用户体验：**

- **响应式设计**：完美适配各种屏幕尺寸
- **表单友好**：清晰的输入提示和错误反馈
- **加载状态**：按钮加载动画，操作状态清晰
- **视觉层次**：合理的间距和字体层级

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

### v2.0.0 (2025-01-XX)

- ✅ **新增用户认证系统**
  - 现代化登录/注册页面设计
  - 完整的表单验证机制
  - JWT token 自动管理
  - 响应式 UI 适配
- ✅ **API 服务优化**
  - 统一的认证服务封装
  - 错误处理和用户反馈
  - TypeScript 类型安全
- ✅ **UI/UX 提升**
  - 渐变背景和玻璃态效果
  - 流畅的动画过渡
  - 现代化的视觉设计
- ✅ **项目结构优化**
  - 新增 services 目录
  - 完善的代码注释
  - 更新项目文档

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
