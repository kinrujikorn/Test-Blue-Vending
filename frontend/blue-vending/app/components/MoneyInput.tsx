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
    <div className="grid grid-cols-4 gap-2">
      {DENOMINATIONS.map((d) => (
        <div key={d} className="flex items-center gap-2">
          <label>{d}</label>
          <input
            type="number"
            min={0}
            value={value[d] ?? 0}
            onChange={(e) => update(d, Number(e.target.value))}
            className="w-16 border px-1"
          />
        </div>
      ))}
    </div>
  );
}
