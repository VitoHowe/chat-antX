/**
 * CSS样式工具函数
 * 提供高优先级样式解决方案，避免使用 !important
 */

/**
 * 生成带有高优先级前缀的CSS类名
 * @param className 原始类名
 * @returns 带前缀的高优先级类名
 */
export const withHighPriority = (className: string): string => {
  return `app-custom-styles ${className}`;
};

/**
 * 生成多个高优先级类名
 * @param classNames 类名数组
 * @returns 带前缀的类名字符串
 */
export const withHighPriorityMultiple = (...classNames: string[]): string => {
  return classNames.map(name => `app-custom-styles ${name}`).join(' ');
};

/**
 * 条件性应用高优先级样式
 * @param condition 条件
 * @param className 类名
 * @returns 条件满足时返回高优先级类名，否则返回空字符串
 */
export const conditionalHighPriority = (condition: boolean, className: string): string => {
  return condition ? withHighPriority(className) : '';
};

/**
 * CSS优先级说明：
 * 
 * 1. 内联样式: 1000
 * 2. ID选择器: 100  
 * 3. 类选择器、属性选择器、伪类: 10
 * 4. 元素选择器、伪元素: 1
 * 
 * 我们使用 .app-custom-styles .your-class 的方式
 * 权重为 10 + 10 = 20，足以覆盖大多数组件库样式
 */

export const CSS_PRIORITY_INFO = {
  inline: 1000,
  id: 100,
  class: 10,
  element: 1,
  ourPrefix: 20, // .app-custom-styles .class-name
} as const; 