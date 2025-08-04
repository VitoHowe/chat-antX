import React from "react";
import { Flex } from "antd";
import styles from "./products.less";
import ProductList from "../components/chat/ProductList";
import Header from "../components/layout/Header";

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
