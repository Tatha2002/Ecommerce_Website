"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id; // ensures correct access
  const router = useRouter();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/products/${id}`);
      setProduct({
        name: res.data.name,
        price: String(res.data.price),
        stock: String(res.data.stock),
      });
    } catch (err) {
      alert("Failed to load product!");
    } finally {
      setLoading(false);
    }
  };

  const update = async () => {
    if (!product.name || !product.price || !product.stock) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/products/${id}`, {
        name: product.name,
        price: Number(product.price),
        stock: Number(product.stock),
      });

      alert("Product updated successfully!");
      router.push("/products");
    } catch (err) {
      alert("Update failed!");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Product</h1>

      <div className="card" style={{ maxWidth: 400 }}>
        <label>Name</label>
        <input
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          placeholder="Product Name"
        />

        <label>Price</label>
        <input
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          placeholder="Price"
        />

        <label>Stock</label>
        <input
          type="number"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
          placeholder="Stock"
        />

        <button onClick={update} className="btn-edit">
          Update Product
        </button>
      </div>
    </div>
  );
}
