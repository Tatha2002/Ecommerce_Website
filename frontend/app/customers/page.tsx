"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);

  const load = async () => {
    const res = await axios.get("http://localhost:3002/customers");
    setCustomers(res.data);
  };

  const deleteCustomer = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    await axios.delete(`http://localhost:3002/customers/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <h1>Customers</h1>

      <Link href="/customers/create">➕ Add Customer</Link>

      {customers.map((c) => (
        <div className="card" key={c.id}>
          <div className="card-title">{c.name}</div>
          <p>Email: {c.email}</p>
          <p>Address: {c.address}</p>

          <Link className="btn-edit" href={`/customers/edit/${c.id}`}>
            Edit
          </Link>

          <button className="btn-delete" onClick={() => deleteCustomer(c.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
