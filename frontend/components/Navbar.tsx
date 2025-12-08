"use client";
import axios from "axios";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        background: "#222",
        padding: "15px",
        display: "flex",
        gap: "20px",
        color: "white",
      }}
    >
      <Link href="/products">Products</Link>
      <Link href="/orders">Orders</Link>
      <Link href="/customers">Customers</Link>
    </nav>
  );
}
