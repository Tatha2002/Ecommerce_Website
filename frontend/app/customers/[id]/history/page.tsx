"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

type HistoryItem = {
  id: string;
  orderId: string;
  customerId: string;
  total: number;
  products: string; // stored JSON string
  orderDate: string;
};

export default function HistoryPage() {
  const params = useParams();
  const id = params?.id;
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get<HistoryItem[]>(`http://localhost:3002/customers/${id}/history`);
      setHistory(res.data || []);
    } catch (err) {
      console.error("Failed to load history", err);
      alert("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Order History</h1>

      {loading && <p>Loading...</p>}

      {history.length === 0 && !loading && <p>No orders found for this customer.</p>}

      {history.map(h => {
        let products: any[] = [];
        try {
          products = JSON.parse(h.products || "[]");
        } catch {
          products = [];
        }

        return (
          <div className="card" key={h.id}>
            <div className="card-title">Order #{h.orderId}</div>
            <div><strong>Date:</strong> {new Date(h.orderDate).toLocaleString()}</div>
            <div><strong>Total:</strong> ₹{h.total}</div>

            <div style={{ marginTop: 8 }}>
              <strong>Products:</strong>
              <ul>
                {products.map((p: any, idx: number) => (
                  <li key={idx}>
                    {p.productId || p.name} — Qty: {p.quantity} — Price: ₹{p.price ?? p.unitPrice ?? 0}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
