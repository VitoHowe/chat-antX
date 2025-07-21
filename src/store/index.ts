/**
 * Redux Store 配置
 * 集成Redux Toolkit和redux-persist
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 默认使用localStorage
import { RootState } from './types';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';

// 持久化配置
const persistConfig = {
  key: 'root',
  storage,
  // 只持久化指定的slice
  whitelist: ['auth', 'settings'],
  // 可以排除某些字段
  // blacklist: ['auth.loading', 'auth.error'],
};

// 合并所有reducers
const rootReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
});

// 创建持久化的reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 配置store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略redux-persist的action类型
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  // 开发环境下启用Redux DevTools
  devTools: process.env.NODE_ENV !== 'production',
});

// 创建持久化store
export const persistor = persistStore(store);

// 类型定义
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type { RootState };

// 类型安全的hooks（推荐在组件中使用这些typed hooks）
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store; 