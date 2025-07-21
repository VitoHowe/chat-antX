# Redux 状态管理使用指南

本项目已集成Redux Toolkit + Redux Persist，用于应用状态管理和持久化存储。

## 🏗️ 架构概览

```
src/store/
├── index.ts              # Redux store 配置和导出
├── types.ts              # TypeScript 类型定义
├── slices/
│   ├── authSlice.ts      # 认证状态管理
│   └── settingsSlice.ts  # 应用设置状态管理
└── README.md             # 本文档
```

## 🔧 配置说明

### Store 配置特性
- ✅ Redux Toolkit (现代化Redux)
- ✅ Redux Persist (状态持久化)
- ✅ TypeScript 完整支持
- ✅ Redux DevTools 集成
- ✅ 模块化Slice设计

### 持久化设置
- 使用localStorage作为存储介质
- 白名单模式：只持久化`auth`和`settings`状态
- 自动忽略加载和错误状态的持久化

## 📖 使用方法

### 1. 在组件中使用状态

```tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { selectAuth, loginSuccess } from '../store/slices/authSlice';

const MyComponent: React.FC = () => {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  
  const handleAction = () => {
    // 分发action
    dispatch(loginSuccess(userInfo));
  };
  
  return (
    <div>
      {auth.isAuthenticated ? '已登录' : '未登录'}
    </div>
  );
};
```

### 2. 认证状态管理

认证状态包含以下字段：
- `isAuthenticated`: 登录状态
- `user`: 用户信息
- `token`: 认证令牌
- `loading`: 加载状态
- `error`: 错误信息

可用的认证actions：
```tsx
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError,
  restoreAuth 
} from '../store/slices/authSlice';
```

### 3. 设置状态管理

应用设置包含：
- `theme`: 主题模式 ('light' | 'dark')
- `language`: 语言设置 ('zh' | 'en')

可用的设置actions：
```tsx
import { 
  setTheme, 
  setLanguage, 
  resetSettings 
} from '../store/slices/settingsSlice';
```

## 🔄 与现有AuthService的集成

Redux已与现有的`AuthService`完全集成：

1. **登录流程**：
   - 调用`AuthService.login()`时自动更新Redux状态
   - 保持localStorage兼容性
   - 状态实时同步到Redux store

2. **退出登录**：
   - 调用`AuthService.logout()`时清除Redux状态
   - 同时清理localStorage

3. **状态恢复**：
   - 应用启动时从localStorage自动恢复状态
   - 通过redux-persist实现无缝状态持久化

## 🧪 测试状态同步

项目中包含`Header`组件用于展示Redux状态：

```tsx
import Header from '../components/Header';

// 在任意页面中使用
<Header />
```

该组件实时显示：
- 当前登录状态
- 用户信息
- 加载状态
- 用户操作菜单

## 🎯 最佳实践

1. **使用类型安全的hooks**：
   ```tsx
   // ✅ 推荐
   import { useAppSelector, useAppDispatch } from '../store';
   
   // ❌ 避免
   import { useSelector, useDispatch } from 'react-redux';
   ```

2. **使用选择器**：
   ```tsx
   // ✅ 推荐 - 使用预定义选择器
   const auth = useAppSelector(selectAuth);
   
   // ✅ 也可以 - 内联选择器
   const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
   ```

3. **错误处理**：
   ```tsx
   const auth = useAppSelector(selectAuth);
   
   useEffect(() => {
     if (auth.error) {
       // 处理错误
       console.error('认证错误:', auth.error);
     }
   }, [auth.error]);
   ```

## 🔮 扩展指南

### 添加新的状态slice

1. 在`src/store/slices/`中创建新的slice文件
2. 在`src/store/types.ts`中添加状态类型定义
3. 在`src/store/index.ts`中导入并添加到rootReducer
4. 根据需要更新persistConfig的whitelist

### 示例：添加UI状态管理

```tsx
// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  notifications: string[];
}

const initialState: UIState = {
  sidebarOpen: true,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    addNotification: (state, action: PayloadAction<string>) => {
      state.notifications.push(action.payload);
    },
  },
});

export const { toggleSidebar, addNotification } = uiSlice.actions;
export default uiSlice.reducer;
```

## 📚 相关文档

- [Redux Toolkit 官方文档](https://redux-toolkit.js.org/)
- [Redux Persist 使用指南](https://github.com/rt2zz/redux-persist)
- [React-Redux Hooks API](https://react-redux.js.org/api/hooks)

---

Redux集成完成！现在你可以在应用中享受现代化的状态管理体验。 