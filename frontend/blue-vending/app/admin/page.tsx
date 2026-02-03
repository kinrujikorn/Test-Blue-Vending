"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { MachineCash, Product } from "../lib/types";

import {
  fetchProducts,
  fetchMachineCash,
  createProduct,
  updateProductStock,
  deleteProduct,
  updateMachineCash,
} from "../api/api";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cash, setCash] = useState<MachineCash[]>([]);
  const [loading, setLoading] = useState(true);

  //Product Edit
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [editStock, setEditStock] = useState<number>(0);

  // MoneyEdit
  const [isEditingCash, setIsEditingCash] = useState(false);
  const [selectedCashId, setSelectedCashId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  //Adding Product
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newStock, setNewStock] = useState(0);

  // Delete Product
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  // Error Check
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    stock?: string;
  }>({});

  const loadData = async () => {
    try {
      const [products, cash] = await Promise.all([
        fetchProducts(),
        fetchMachineCash(),
      ]);

      setProducts(products);
      setCash(cash);
    } catch (err) {
      console.error("Admin fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ useEffect เหลือแค่ตัวเดียว
  useEffect(() => {
    loadData();
  }, []);

  // ✅ updateStock เรียกใช้ loadData ได้แล้ว
  const updateStock = async (productId: number) => {
    if (editStock < 0) return;

    try {
      await updateProductStock(productId, editStock);
      await loadData();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const updateCash = async (cashId: number) => {
    if (editQuantity < 0) return;

    try {
      await updateMachineCash(cashId, editQuantity);
      await loadData();
      setIsEditingCash(false);
    } catch (err) {
      console.error(err);
    }
  };

  const addProduct = async () => {
    if (!validateAddProduct()) return;

    try {
      await createProduct({
        name: newName,
        price: newPrice,
        stock: newStock,
      });

      await loadData();
      setNewName("");
      setNewPrice(0);
      setNewStock(0);
      setIsAddingProduct(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProductHandler = async () => {
    if (!deleteProductId) return;

    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(deleteProductId);
      await loadData();
      setIsDeleting(false);
      setDeleteProductId(null);
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-neutral-900">
        Loading admin data...
      </main>
    );
  }
  // Validate Form
  const validateAddProduct = () => {
    const newErrors: typeof errors = {};

    if (!newName.trim()) {
      newErrors.name = "Product name is required";
    }

    if (newPrice === null || newPrice === undefined || newPrice <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (newStock === null || newStock === undefined || newStock < 0) {
      newErrors.stock = "Quantity must be 0 or more";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const totalMoney = cash.reduce(
    (sum, c) => sum + c.denomination * c.quantity,
    0,
  );

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-neutral-900">
        Loading admin data...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-white px-10 py-8">
      <h1 className="text-3xl font-bold mb-8">🛠 Admin Dashboard</h1>

      <div className="absolute top-6 right-8 z-50">
        <Link
          href="/"
          className="
      bg-white text-black
      px-4 py-2
      rounded-lg
      text-sm font-medium
      border border-neutral-300
      hover:bg-neutral-100
      transition
    "
        >
          ← Back to Vending
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products List */}
        <section className="bg-neutral-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">📦 Products</h2>

            <div className="flex gap-2">
              <button
                onClick={() => setIsAddingProduct(true)}
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
              >
                Add Product
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => setIsDeleting(true)}
                className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>

          <p className="text-sm text-neutral-400">
            Total products: {products.length}
          </p>
          <ul className="space-y-2">
            {products.map((p) => (
              <li className="flex items-center justify-between px-4 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-neutral-400">
                    {p.price} THB · stock {p.stock}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    p.stock === 0
                      ? "bg-red-600/20 text-red-400"
                      : "bg-green-600/20 text-green-400"
                  }`}
                >
                  {p.stock === 0 ? "Out of stock" : "Available"}
                </span>
              </li>
            ))}
          </ul>

          {isAddingProduct && (
            <div className="mt-6 bg-neutral-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Add New Product</h3>

              <input
                className={`w-full mb-1 p-2 rounded bg-neutral-900 ${
                  errors.name ? "border border-red-500" : ""
                }`}
                placeholder="Product name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mb-2">{errors.name}</p>
              )}
              <h2>Price</h2>
              <input
                type="number"
                min={0}
                className={`w-full mb-1 p-2 rounded bg-neutral-900 ${
                  errors.price ? "border border-red-500" : ""
                }`}
                placeholder="Price"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
              />
              {errors.price && (
                <p className="text-red-400 text-sm mb-2">{errors.price}</p>
              )}
              <h2>Quantity</h2>
              <input
                type="number"
                min={0}
                className={`w-full mb-1 p-2 rounded bg-neutral-900 ${
                  errors.stock ? "border border-red-500" : ""
                }`}
                placeholder="Quantity"
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
              />
              {errors.stock && (
                <p className="text-red-400 text-sm mb-2">{errors.stock}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (!validateAddProduct()) return;
                    addProduct();
                  }}
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                >
                  Add
                </button>

                <button
                  onClick={() => setIsAddingProduct(false)}
                  className="bg-neutral-600 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="mt-6 bg-neutral-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Edit Product Stock</h3>

              {/* Select Product */}
              <select
                className="w-full mb-3 p-2 rounded bg-neutral-900"
                value={selectedProductId ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const product = products.find((p) => p.id === id);

                  setSelectedProductId(id);
                  setEditStock(product?.stock ?? 0);
                }}
              >
                <option value="" disabled>
                  Select product
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* Stock Input */}
              <input
                type="number"
                min={0}
                className="w-full mb-4 p-2 rounded bg-neutral-900"
                value={editStock}
                onChange={(e) => setEditStock(Number(e.target.value))}
              />

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  disabled={selectedProductId === null || editStock < 0}
                  onClick={() => updateStock(selectedProductId!)}
                  className="bg-green-600 px-4 py-2 rounded disabled:opacity-50"
                >
                  Confirm
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-neutral-600 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isDeleting && (
            <div className="mt-6 bg-neutral-800 p-6 rounded-xl border border-red-500">
              <h3 className="text-lg font-semibold mb-4 text-red-400">
                Delete Product
              </h3>

              <select
                className="w-full mb-4 p-2 rounded bg-neutral-900"
                value={deleteProductId ?? ""}
                onChange={(e) => setDeleteProductId(Number(e.target.value))}
              >
                <option value="" disabled>
                  Select product
                </option>

                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (stock: {p.stock})
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  disabled={!deleteProductId}
                  onClick={deleteProductHandler}
                  className="bg-red-600 px-4 py-2 rounded disabled:opacity-50"
                >
                  Confirm Delete
                </button>

                <button
                  onClick={() => {
                    setIsDeleting(false);
                    setDeleteProductId(null);
                  }}
                  className="bg-neutral-600 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Machine Cash */}
        <section className="bg-neutral-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">💰 Machine Cash</h2>
            <p className="text-sm text-neutral-400">
              Total money: {totalMoney} THB
            </p>
            <button
              onClick={() => setIsEditingCash(true)}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
            >
              Edit
            </button>
          </div>

          <ul className="space-y-2">
            {cash.map((c) => (
              <li className="flex justify-between items-center px-4 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-800">
                <span className="font-medium">{c.denomination} Baht</span>

                <span className="text-neutral-400">× {c.quantity}</span>
              </li>
            ))}
          </ul>

          {isEditingCash && (
            <div className="mt-6 bg-neutral-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Edit Machine Cash</h3>

              {/* Select denomination */}
              <select
                className="w-full mb-3 p-2 rounded bg-neutral-900"
                value={selectedCashId ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const cashItem = cash.find((c) => c.id === id);

                  setSelectedCashId(id);
                  setEditQuantity(cashItem?.quantity ?? 0);
                }}
              >
                <option value="" disabled>
                  Select denomination
                </option>
                {cash.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.denomination} บาท
                  </option>
                ))}
              </select>

              {/* Quantity input */}
              <input
                type="number"
                min={0}
                className="w-full mb-4 p-2 rounded bg-neutral-900"
                value={editQuantity}
                onChange={(e) => setEditQuantity(Number(e.target.value))}
              />

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  disabled={selectedCashId === null || editQuantity < 0}
                  onClick={() => updateCash(selectedCashId!)}
                  className="bg-green-600 px-4 py-2 rounded disabled:opacity-50"
                >
                  Confirm
                </button>

                <button
                  onClick={() => setIsEditingCash(false)}
                  className="bg-neutral-600 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
