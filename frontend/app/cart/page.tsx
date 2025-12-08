"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const router = useRouter();

  const proceedToCheckout = () => {
    // Navigate to order creation page (frontend handles posting)
    router.push("/orders/create");
  };

  return (
    <div>
      <h1>Your Cart</h1>

      {items.length === 0 && (
        <div>
          <p>Your cart is empty.</p>
          <Link href="/products">Browse Products</Link>
        </div>
      )}

      {items.map((it) => (
        <div key={it.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="card-title">{it.name}</div>
            <div>Price: ₹{it.price}</div>
            <div>
              Quantity:
              <input
                type="number"
                min={0}
                value={it.quantity}
                onChange={(e) => updateQuantity(it.id, Number(e.target.value))}
                style={{ width: 80, marginLeft: 8 }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => removeFromCart(it.id)} className="btn-delete">Remove</button>
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 8 }}><strong>Total:</strong> ₹{total}</div>
          <button onClick={proceedToCheckout} style={{ marginRight: 8 }}>Checkout</button>
          <button onClick={() => { if (confirm("Clear cart?")) clearCart(); }} className="btn-delete">Clear Cart</button>
        </div>
      )}
    </div>
  );
}
