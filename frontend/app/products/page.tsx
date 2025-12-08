"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Product[]>("http://localhost:3001/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
      alert("Failed to load products from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Products</h1>
        <Link href="/products/create">
          <button>Create Product</button>
        </Link>
      </div>

      {loading && <p>Loading...</p>}

      {products.map((p) => (
        <div key={p.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="card-title">{p.name}</div>
            <div style={{ marginTop: 6 }}>{p.description}</div>
            <div style={{ marginTop: 6 }}><strong>Price:</strong> ₹{p.price}</div>
            <div><small>Stock: {p.stock}</small></div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={() => {
                if (p.stock <= 0) {
                  alert("Out of stock");
                  return;
                }
                addToCart({ id: p.id, name: p.name, price: Number(p.price) }, 1);
                alert("Added to cart");
              }}
            >
              Add to Cart
            </button>

            <Link href={`/products/edit/${p.id}`} style={{ textDecoration: "none" }}>
              <button>✏ Edit</button>
            </Link>
          </div>
        </div>
      ))}

      {products.length === 0 && !loading && <p>No products found.</p>}
    </div>
  );
}
