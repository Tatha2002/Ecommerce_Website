"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function HeaderClient() {
  const { count } = useCart();

  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #eee" }}>
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: 12,
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <Link href="/">
          <strong>MyShop</strong>
        </Link>

        <nav style={{ marginLeft: 12, display: "flex", gap: 12 }}>
          <Link href="/products">Products</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/customers">Customers</Link>
        </nav>

        <div style={{ marginLeft: "auto" }}>
          <Link href="/cart">Cart ({count})</Link>
        </div>
      </div>
    </header>
  );
}
