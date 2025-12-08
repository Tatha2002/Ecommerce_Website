"use client";

import { useState } from "react";
import axios from "axios";

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    price: 0,
    stock: 0,
  });

  const submit = async () => {
    await axios.post("http://localhost:3001/products", form);
    alert("Product created!");
  };

  return (
    <div>
      <h1>Add Product</h1>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <br />

      <input
        type="number"
        placeholder="Price"
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />
      <br />

      <input
        type="number"
        placeholder="Stock"
        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
      />
      <br />

      <button onClick={submit}>Create</button>
    </div>
  );
}
