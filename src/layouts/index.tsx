/*
 * @Description:
 * @Version: 2.0
 * @Autor: MyStery
 * @Date: 2025-06-30 21:54:00
 * @LastEditors: MyStery
 * @LastEditTime: 2025-07-01 00:18:10
 */
import React from 'react';
import { Link, Outlet } from "umi";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Spin } from 'antd';
import { store, persistor } from '@/store';
import styles from "./index.less";
// 导入全局样式
import '@/styles/global.css';
import '@/styles/reset.css';
export default function Layout() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}>
            <Spin size="large" tip="加载中..." />
          </div>
        } 
        persistor={persistor}
      >
        <div
          className={`app-custom-styles ${styles.navs}`}
          style={{ height: "100vh", overflow: "hidden" }}
        >
          {/* <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/docs">Docs</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <a href="https://github.com/umijs/umi">Github</a>
            </li>
          </ul> */}
          <Outlet />
        </div>
      </PersistGate>
    </Provider>
  );
}
