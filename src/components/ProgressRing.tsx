type ProgressRingProps = {
  value: number;
  total: number;
};

export function ProgressRing({ value, total }: ProgressRingProps) {
  const percent = Math.min(100, Math.round((value / total) * 100));
  return (
    <div className="grid h-20 w-20 place-items-center rounded-full bg-white shadow-inner">
      <div
        className="grid h-16 w-16 place-items-center rounded-full text-sm font-black text-slate-700"
        style={{
          background: `conic-gradient(#facc15 ${percent}%, #e0f2fe ${percent}%)`
        }}
      >
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white">
          {value}/{total}
        </div>
      </div>
    </div>
  );
}
