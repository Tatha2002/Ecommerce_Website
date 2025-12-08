"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateCustomer() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const submit = async () => {
    await axios.post("http://localhost:3002/customers", form);
    alert("Customer Created!");
    router.push("/customers");
  };

  return (
    <div className="container">
      <h1>Create Customer</h1>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <br />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <br />

      <input
        placeholder="Address"
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      <br />

      <button onClick={submit}>Create</button>
    </div>
  );
}
