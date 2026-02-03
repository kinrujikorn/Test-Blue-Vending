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
      className={`
        rounded-xl p-5 text-left border transition
        ${
          selected
            ? "border-blue-500 bg-blue-500/10"
            : "border-neutral-700 hover:border-neutral-500"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
      `}
    >
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-neutral-300">Price: {product.price} THB</p>
      <p className="text-sm text-neutral-300">Stock: {product.stock}</p>

      {disabled && <p className="mt-2 text-sm text-red-400">Sold out</p>}
    </button>
  );
}
