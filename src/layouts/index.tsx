/*
 * @Description:
 * @Version: 2.0
 * @Autor: MyStery
 * @Date: 2025-06-30 21:54:00
 * @LastEditors: MyStery
 * @LastEditTime: 2025-07-01 00:18:10
 */
import { Link, Outlet } from "umi";
import styles from "./index.less";

export default function Layout() {
  return (
    <div
      className={styles.navs}
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
  );
}
