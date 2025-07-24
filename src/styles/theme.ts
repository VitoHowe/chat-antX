/**
 * 设计系统主题配置
 * 统一管理颜色、间距、字体等设计token
 */

export const theme = {
  // 颜色系统
  colors: {
    // 主色调
    primary: {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      main: '#667eea',
      light: '#8a9bff',
      dark: '#4f6bdc',
    },
    
    // 功能色
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',
    
    // 中性色
    neutral: {
      white: '#ffffff',
      gray50: '#fafafa',
      gray100: '#f5f5f5',
      gray200: '#e8e8e8',
      gray300: '#d9d9d9',
      gray400: '#bfbfbf',
      gray500: '#8c8c8c',
      gray600: '#595959',
      gray700: '#434343',
      gray800: '#262626',
      gray900: '#1f1f1f',
    },
    
    // 毛玻璃效果
    glass: {
      background: 'rgba(255, 255, 255, 0.15)',
      backgroundLight: 'rgba(255, 255, 255, 0.08)',
      backgroundDark: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.2)',
      borderLight: 'rgba(255, 255, 255, 0.1)',
    },
  },
  
  // 间距系统
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  
  // 圆角系统
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  
  // 阴影系统
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.06)',
    md: '0 4px 16px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 16px rgba(0, 0, 0, 0.08)',
    xl: '0 20px 40px rgba(0, 0, 0, 0.15)',
    
    // 特殊阴影
    primary: '0 4px 16px rgba(102, 126, 234, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)',
    primaryHover: '0 6px 20px rgba(102, 126, 234, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  
  // 字体系统
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: {
      xs: '11px',
      sm: '12px',
      base: '14px',
      lg: '16px',
      xl: '18px',
      xxl: '24px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // 过渡动画
  transitions: {
    fast: 'all 0.2s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
  
  // 毛玻璃效果
  backdropFilter: {
    sm: 'blur(10px)',
    md: 'blur(20px)',
    lg: 'blur(40px)',
  },
  
  // Z-index层级
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

export type Theme = typeof theme; 