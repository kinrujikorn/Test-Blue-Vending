const DENOMINATIONS = [1, 5, 10, 20, 50, 100, 500, 1000];

type Props = {
  value: Record<number, number>;
  onChange: (val: Record<number, number>) => void;
};

export default function MoneyInput({ value, onChange }: Props) {
  const update = (d: number, qty: number) => {
    onChange({ ...value, [d]: qty });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {DENOMINATIONS.map((d) => (
        <div
          key={d}
          className="flex items-center justify-between bg-neutral-700 rounded-lg px-3 py-2"
        >
          <span>{d} THB</span>
          <input
            type="number"
            min={0}
            value={value[d] ?? 0}
            onChange={(e) => update(d, Number(e.target.value))}
            className="w-16 bg-neutral-900 border border-neutral-600 rounded px-2 text-right"
          />
        </div>
      ))}
    </div>
  );
}
