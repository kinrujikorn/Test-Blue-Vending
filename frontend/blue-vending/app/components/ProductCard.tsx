import { Product } from "../lib/types";

type Props = {
  product: Product;
  selected: boolean;
  onSelect: () => void;
};

export default function ProductCard({ product, selected, onSelect }: Props) {
  const disabled = product.stock === 0;

  return (
    <button
      disabled={disabled}
      onClick={onSelect}
      className={`border rounded p-4 text-left
        ${selected ? "border-blue-500" : "border-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <h3 className="font-semibold">{product.name}</h3>
      <p>Price: {product.price} THB</p>
      <p>Stock: {product.stock}</p>
      {disabled && <p className="text-red-500">Sold out</p>}
    </button>
  );
}
