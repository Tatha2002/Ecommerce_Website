"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function EditOrderPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) load();
  }, [id]);

  const load = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Load order failed", err);
      alert("Failed to load order");
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const item = order.items[0];
      const total = (Number(item.price) || 0) * (Number(item.quantity) || 1);

      await axios.put(`http://localhost:3001/orders/${id}`, {
        customerId: order.customerId,
        total,
        items: [item],
      });

      alert("Order updated");
      router.push("/orders");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!order) return <p>Loading...</p>;

  const item = order.items[0] || {};

  return (
    <div className="container">
      <h1>Edit Order #{id}</h1>

      <label>Customer ID</label>
      <input
        value={order.customerId}
        onChange={(e) => setOrder({ ...order, customerId: e.target.value })}
      />

      <label>Product ID</label>
      <input
        value={item.productId}
        onChange={(e) =>
          setOrder({
            ...order,
            items: [{ ...item, productId: e.target.value }],
          })
        }
      />

      <label>Quantity</label>
      <input
        type="number"
        value={item.quantity}
        onChange={(e) =>
          setOrder({
            ...order,
            items: [{ ...item, quantity: Number(e.target.value) }],
          })
        }
      />

      <label>Price (per unit)</label>
      <input
        type="number"
        value={item.price}
        onChange={(e) =>
          setOrder({
            ...order,
            items: [{ ...item, price: Number(e.target.value) }],
          })
        }
      />

      <button onClick={submit} disabled={submitting}>
        {submitting ? "Updating..." : "Update Order"}
      </button>
    </div>
  );
}
