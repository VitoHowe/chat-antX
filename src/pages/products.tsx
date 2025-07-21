import React from "react";
import styles from "./products.less";
import ProductList from "../components/ProductList";

export default function Page() {
  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <ProductList />
    </div>
  );
}
