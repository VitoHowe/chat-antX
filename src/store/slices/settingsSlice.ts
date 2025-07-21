/**
 * 应用设置 Redux Slice
 * 管理主题、语言等应用设置
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState } from '../types';

// 初始状态
const initialState: SettingsState = {
  theme: 'light',
  language: 'zh',
};

// 创建设置slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // 切换主题
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    
    // 切换语言
    setLanguage: (state, action: PayloadAction<'zh' | 'en'>) => {
      state.language = action.payload;
    },
    
    // 重置设置
    resetSettings: (state) => {
      state.theme = 'light';
      state.language = 'zh';
    },
  },
});

// 导出actions
export const {
  setTheme,
  setLanguage,
  resetSettings,
} = settingsSlice.actions;

// 选择器
export const selectSettings = (state: { settings: SettingsState }) => state.settings;
export const selectTheme = (state: { settings: SettingsState }) => state.settings.theme;
export const selectLanguage = (state: { settings: SettingsState }) => state.settings.language;

// 导出reducer
export default settingsSlice.reducer; 