


const TOTAL = 9000;

type Props = { payments: { amount: number }[] };

function formatDT(n: number) {
  return new Intl.NumberFormat("fr-TN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(n);
}

export default function Dashboard({ payments }: Props) {
  const total     = payments.reduce((a, p) => a + p.amount, 0);
  const remaining = Math.max(TOTAL - total, 0);
  const progress  = Math.min((total / TOTAL) * 100, 100);

  const barColor =
    progress >= 100 ? "from-emerald-500 to-emerald-400" :
    progress >= 60  ? "from-indigo-500 to-violet-500"   :
    progress >= 30  ? "from-indigo-600 to-indigo-400"   :
                      "from-slate-500 to-indigo-500";

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-6 mb-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">
            Orthomar ERP
          </p>
          <h2 className="text-2xl font-semibold text-white">Suivi des paiements</h2>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold text-white">
            {progress.toFixed(1)}
            <span className="text-slate-400 text-xl">%</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">avancement global</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-white/6 rounded-full overflow-hidden mb-6">
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${barColor} bar-animated transition-all`}
          style={{ "--bar-width": `${progress}%` } as React.CSSProperties}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Total convenu",  value: formatDT(TOTAL),      sub: "budget total",   color: "text-slate-300"  },
          { label: "Versé",          value: formatDT(total),       sub: `${payments.length} versement${payments.length !== 1 ? "s" : ""}`, color: "text-emerald-400" },
          { label: "Restant",        value: formatDT(remaining),   sub: "à verser",       color: "text-indigo-400"  },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white/4 rounded-xl p-4 border border-white/6 min-w-0">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 truncate">{label}</p>
            <p className={`font-mono font-semibold ${color} leading-tight break-all text-base`}>
              {value}
              <span className="text-slate-500 font-normal text-xs ml-1">DT</span>
            </p>
            <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}