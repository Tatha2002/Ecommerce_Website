"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  name: string;
  email: string;
};

export default function CreateOrderPage() {
  const { items, total, clearCart } = useCart();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await axios.get<Customer[]>("http://localhost:3002/customers");
      setCustomers(res.data || []);
      if ((res.data || []).length > 0) setSelectedCustomer(res.data[0].id);
    } catch (err) {
      console.error("Failed to load customers", err);
      alert("Failed to load customers. Make sure customer service is running.");
    }
  };

  const submit = async () => {
    if (!selectedCustomer) {
      alert("Select a customer first");
      return;
    }
    if (!items || items.length === 0) {
      alert("Cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      // Build payload compatible with your Orders service
      const payload = {
        customerId: selectedCustomer,
        total,
        items: items.map(it => ({
          productId: it.id,
          quantity: it.quantity,
          price: it.price,
        })),
      };

      await axios.post("http://localhost:3001/orders", payload);

      alert("Order placed successfully!");
      clearCart();
      router.push("/orders");
    } catch (err) {
      console.error("Create order failed", err);
      alert("Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <h1>Checkout</h1>

      <div className="card">
        <label>Choose Customer</label>
        <br />
        <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} style={{ padding: 8 }}>
          <option value="">-- Select Customer --</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.email}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Order Items</h3>
        {items.map(it => (
          <div key={it.id} className="card">
            <div className="card-title">{it.name}</div>
            <div>Qty: {it.quantity}</div>
            <div>Price: ₹{it.price}</div>
            <div>Subtotal: ₹{(it.price || 0) * it.quantity}</div>
          </div>
        ))}

        <div style={{ marginTop: 8 }}>
          <strong>Total:</strong> ₹{total}
        </div>

        <div style={{ marginTop: 12 }}>
          <button onClick={submit} disabled={submitting}>
            {submitting ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
