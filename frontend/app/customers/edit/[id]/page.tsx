"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function EditCustomer() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const load = async () => {
    const res = await axios.get(`http://localhost:3002/customers/${id}`);
    setForm({
      name: res.data.name,
      email: res.data.email,
      address: res.data.address,
    });
  };

  const submit = async () => {
    await axios.put(`http://localhost:3002/customers/${id}`, form);
    alert("Customer Updated!");
    router.push("/customers");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <h1>Edit Customer</h1>

      <input
        value={form.name}
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        value={form.email}
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        value={form.address}
        placeholder="Address"
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <button onClick={submit}>Update</button>
    </div>
  );
}
