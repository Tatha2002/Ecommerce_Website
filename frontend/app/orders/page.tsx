"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function OrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    try {
      await axios.delete(`http://localhost:3001/orders/${id}`);
      await load();
      alert("Order deleted");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete order");
    }
  };

  return (
    <div className="container">
      <h1>Orders</h1>

      <Link href="/orders/create" className="btn-main">
        ➕ Create Order
      </Link>

      {loading && <p>Loading...</p>}

      {orders.map((o) => (
        <div key={o.id} className="card">
          <div className="card-info">
            <div className="card-title">Order #{o.id}</div>

            <p><strong>Customer:</strong> {o.customerId}</p>
            <p><strong>Total Amount:</strong> ₹{o.total}</p>

            {/* Small compact item list */}
            <div style={{ marginTop: 8 }}>
              <strong>Items:</strong>
              <ul style={{ paddingLeft: 18 }}>
                {(o.items || []).map((it: any, idx: number) => (
                  <li key={idx}>
                    {it.productId} — {it.quantity} pcs
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="btn-group">
            <Link href={`/orders/edit/${o.id}`} className="btn-edit">
              Edit
            </Link>

            <button className="btn-delete" onClick={() => deleteOrder(o.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      {!loading && orders.length === 0 && <p>No orders yet.</p>}
    </div>
  );
}
