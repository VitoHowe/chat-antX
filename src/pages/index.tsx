/*
 * @Description:
 * @Version: 2.0
 * @Autor: MyStery
 * @Date: 2025-06-30 21:54:00
 * @LastEditors: MyStery
 * @LastEditTime: 2025-07-08 20:50:25
 */
import React from "react";
import { Flex } from "antd";
import styles from "./products.less";
import ProductList from "../components/ProductList";
import Header from "../components/Header";

export default function Page() {
  return (
    <Flex
      vertical
      style={{
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Header 固定高度 */}
      <div style={{ flexShrink: 0 }}>
        <Header />
      </div>
      
      {/* ProductList 自适应剩余空间 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ProductList />
      </div>
    </Flex>
  );
}
