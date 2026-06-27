import { useState } from "react";
import { HiTrash, HiChevronDown, HiChevronUp } from "react-icons/hi2";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import toast from "react-hot-toast";
import type { Payment } from "../types";

type Props = {
  payments: Payment[];
  onDelete: (id: string) => Promise<void>;
};

export default function PaymentList({ payments, onDelete }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sorted = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce versement ?")) return;
    setDeletingId(id);
    try {
      await onDelete(id);
      toast.success("Versement supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/3 transition-colors"
      >
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">Historique</p>
          <h2 className="text-lg font-semibold text-white">
            Versements reçus{" "}
            <span className="text-slate-500 font-normal text-base">({payments.length})</span>
          </h2>
        </div>
        {collapsed ? (
          <HiChevronDown className="text-slate-500 text-xl" />
        ) : (
          <HiChevronUp className="text-slate-500 text-xl" />
        )}
      </button>

      {!collapsed && (
        <div className="px-6 pb-6">
          {sorted.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-600 text-sm">Aucun versement enregistré</p>
              <p className="text-slate-700 text-xs mt-1">Ajoutez votre premier paiement ci-dessus</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sorted.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl px-4 py-3 bg-white/4 border border-white/6 group hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-slate-600 w-5">{sorted.length - idx}</span>
                    <div>
                      <p className="font-mono text-sm font-semibold text-white">
                        {p.amount.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}{" "}
                        <span className="text-slate-500 font-normal">DT</span>
                      </p>
                      {p.note && (
                        <p className="text-xs text-slate-500 mt-0.5">{p.note}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-xs text-slate-500 font-mono">
                      {format(new Date(p.date), "dd MMM yyyy", { locale: fr })}
                    </p>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30"
                      title="Supprimer"
                    >
                      <HiTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
