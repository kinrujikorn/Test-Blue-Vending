"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./components/ProductCard";
import MoneyInput from "./components/MoneyInput";
import { Product } from "./lib/types";
import { fetchProducts, purchaseProduct } from "./api/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [selected, setSelected] = useState<number | null>(null);
  const [money, setMoney] = useState<Record<number, number>>({});
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [change, setChange] = useState<Record<number, number>>({});

  const selectedProduct = products.find((p) => p.id === selected);

  // Fetch Products
  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      setMessage("Cannot load products");
    }
  };
  useEffect(() => {
    loadProducts();
  }, []);

  // Calculate totalMoney
  const totalMoney = Object.entries(money).reduce(
    (sum, [d, q]) => sum + Number(d) * q,
    0,
  );

  //Purchase Step
  const buy = async () => {
    if (!selectedProduct) {
      setMessage("Please select a product");
      return;
    }

    try {
      const data = await purchaseProduct({
        product_id: selectedProduct.id,
        inserted_money: money,
      });

      if (!data.success) {
        setMessage(data.message);
      } else {
        setMessage("✅ Purchase success!");
        setChange(data.change);
        setMoney({});
        setSelected(null);
        await loadProducts();
      }
    } catch {
      setMessage("Backend error");
    }
  };

  // Calculate remaining
  const remaining = selectedProduct
    ? Math.max(selectedProduct.price - totalMoney, 0)
    : 0;

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <h1 className="text-3xl font-bold text-center py-8">
        🥤 Simple Vending Machine
      </h1>
      <div className="absolute top-6 right-8 z-50">
        <Link
          href="/admin"
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
          Admin Panel
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-10">
        {/* LEFT: PRODUCTS */}
        <section className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Products</h2>

          <div className="grid grid-cols-1 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                selected={selected === p.id}
                onSelect={() => {
                  setSelected(p.id);
                  setMessage("");
                  setChange({});
                }}
              />
            ))}
          </div>
        </section>

        {/* CENTER: SELECTED PRODUCT */}
        <section className="bg-neutral-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">🎯 Selected</h2>

          {!selectedProduct ? (
            <p className="text-neutral-400">Select a product</p>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-2">
                {selectedProduct.name}
              </h3>

              <p className="text-green-400 text-lg mb-1">
                Price: {selectedProduct.price} THB
              </p>

              <p className="text-neutral-400 mb-4">
                Stock: {selectedProduct.stock}
              </p>

              <div className="border-t border-neutral-700 pt-4 space-y-1">
                <p>
                  Inserted:{" "}
                  <span className="font-semibold">{totalMoney} THB</span>
                </p>
                <p>
                  Remaining:{" "}
                  <span
                    className={
                      remaining === 0 ? "text-green-400" : "text-red-400"
                    }
                  >
                    {remaining} THB
                  </span>
                </p>
              </div>
            </>
          )}
        </section>

        {/* RIGHT: PAYMENT */}
        <section className="bg-neutral-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">💰 Insert Money</h2>

          <MoneyInput value={money} onChange={setMoney} />

          <p className="mt-4 text-lg">
            Total: <span className="font-bold">{totalMoney}</span> THB
          </p>

          <button
            onClick={buy}
            disabled={!selectedProduct || totalMoney < selectedProduct.price}
            className={`
              w-full mt-6 py-3 rounded-lg font-semibold transition
              ${
                !selectedProduct
                  ? "bg-gray-600 cursor-not-allowed"
                  : remaining > 0
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-green-600 hover:bg-green-500"
              }
            `}
          >
            {!selectedProduct
              ? "Select a product"
              : remaining > 0
                ? `Insert ${remaining} THB more`
                : `Buy ${selectedProduct.name}`}
          </button>

          {/* CHANGE */}
          {Object.keys(change).length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">💰 Change</h3>
              <div className="border border-neutral-700 rounded-lg p-4 bg-neutral-900">
                <ul className="space-y-1">
                  {Object.entries(change)
                    .sort((a, b) => Number(b[0]) - Number(a[0]))
                    .map(([d, q]) => (
                      <li key={d} className="flex justify-between">
                        <span>{d} THB</span>
                        <span>× {q}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}

          {message && (
            <p className="mt-4 text-center text-green-400">{message}</p>
          )}
        </section>
      </div>
    </main>
  );
}
