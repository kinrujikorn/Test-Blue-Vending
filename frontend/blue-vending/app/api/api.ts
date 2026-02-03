// app/api.ts
import { Product, MachineCash } from "../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// PRODUCTS
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Fetch products failed");
  return res.json();
}

export async function createProduct(payload: {
  name: string;
  price: number;
  stock: number;
}) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Create product failed");
  return res.json();
}

export async function updateProductStock(productId: number, stock: number) {
  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stock }),
  });

  if (!res.ok) throw new Error("Update stock failed");
}

export async function deleteProduct(productId: number) {
  const res = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Delete product failed");
}

//  MACHINE CASH
export async function fetchMachineCash(): Promise<MachineCash[]> {
  const res = await fetch(`${API_URL}/machine-cash`);
  if (!res.ok) throw new Error("Fetch cash failed");
  return res.json();
}

export async function updateMachineCash(cashId: number, quantity: number) {
  const res = await fetch(`${API_URL}/machine-cash/${cashId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) throw new Error("Update machine cash failed");
}

// PURCHASE
export async function purchaseProduct(payload: {
  product_id: number;
  inserted_money: Record<number, number>;
}) {
  const res = await fetch(`${API_URL}/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Purchase failed");
  return res.json();
}
