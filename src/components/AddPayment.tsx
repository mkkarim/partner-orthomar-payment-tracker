import { useState } from "react";
import { HiPlus } from "react-icons/hi2";
import toast from "react-hot-toast";
import { format } from "date-fns";

type Props = { onAdd: (amount: number, note: string, date: string) => Promise<void> };

// Helper : today's date as YYYY-MM-DD for the date input default value
const todayValue = () => format(new Date(), "yyyy-MM-dd");

export default function AddPayment({ onAdd }: Props) {
  const [amount,  setAmount]  = useState("");
  const [note,    setNote]    = useState("");
  const [date,    setDate]    = useState(todayValue());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const num = parseFloat(amount.replace(",", "."));
    if (!num || num <= 0) {
      toast.error("Montant invalide");
      return;
    }
    if (!date) {
      toast.error("Date requise");
      return;
    }
    setLoading(true);
    try {
      // Build ISO string from the chosen date (midnight local time)
      const isoDate = new Date(date + "T00:00:00").toISOString();
      await onAdd(num, note.trim(), isoDate);
      setAmount("");
      setNote("");
      setDate(todayValue());
      toast.success(`${num.toLocaleString("fr-TN")} DT enregistré`);
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-6 mb-5">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">Nouveau</p>
      <h2 className="text-lg font-semibold text-white mb-4">Ajouter un versement</h2>

      {/* Row 1 : montant + date */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        {/* Montant */}
        <div className="relative flex-1">
          <input
            type="number"
            placeholder="Montant"
            className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
            value={amount}
            min="0"
            step="0.001"
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono pointer-events-none">DT</span>
        </div>

        {/* Date */}
        <div className="relative flex-1">
          <input
            type="date"
            className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all appearance-none
              [color-scheme:dark]"
            value={date}
            max={todayValue()}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Row 2 : note + bouton */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Note (optionnel)"
          className="flex-1 bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
          value={note}
          maxLength={80}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !amount || !date}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium text-sm transition-all active:scale-95 whitespace-nowrap"
        >
          <HiPlus className="text-lg" />
          {loading ? "Enregistrement…" : "Ajouter"}
        </button>
      </div>
    </div>
  );
}