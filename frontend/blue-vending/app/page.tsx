"use client";

import { useState } from "react";
import { mockProduct } from "./lib/mock";
import ProductCard from "./components/ProductCard";
import MoneyInput from "./components/MoneyInput";
import { Product } from "./lib/types";

export default function Home() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [money, setMoney] = useState<Record<number, number>>({});
  const [message, setMessage] = useState("");

  const buy = () => {
    if (!selected) {
      setMessage("Please select a product");
    } else {
      setMessage(`Inserted  THB for ${selected.name}`);
    }
  };

  const totalMoney = Object.entries(money).reduce(
    (sum, [d, q]) => sum + Number(d) * q,
    0,
  );

  return (
    <main className="">
      <h1 className="flex text-2xl font-bold justify-center py-10">
        Simple Vending Machine
      </h1>

      <section className="grid grid-cols-3 gap-4">
        {mockProduct.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            selected={selected?.id === p.id}
            onSelect={() => setSelected(p)}
          />
        ))}
      </section>

      <section>
        <h2 className="font-semibold mb-2">Insert Money</h2>
        <MoneyInput value={money} onChange={setMoney} />
        <p className="mt-2">Total: {totalMoney} THB</p>
      </section>

      <button
        onClick={buy}
        className="bg-blue-600 text-white mx-20 my-10 px-4 py-4 rounded"
      >
        Buy
      </button>

      {message && <p className="text-green-600">{message}</p>}
    </main>
  );
}
