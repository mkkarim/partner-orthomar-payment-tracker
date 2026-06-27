import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { auth, db } from "./services/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy,
} from "firebase/firestore";

import Dashboard   from "./components/Dashboard";
import AddPayment  from "./components/AddPayment";
import PaymentList from "./components/PaymentList";
import Login       from "./components/Login";
import type { Payment } from "./types";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

// ← collection séparée
const COLLECTION = "partnerPayments";

const toastStyle = {
  style: {
    background: "#1e2130",
    color: "#e8eaf0",
    border: "1px solid rgba(255,255,255,0.08)",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "14px",
  },
};

export default function App() {
  const [user,      setUser]      = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [payments,  setPayments]  = useState<Payment[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) { setPayments([]); setLoading(false); return; }
    setLoading(true);
    const q = query(collection(db, COLLECTION), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPayments(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Payment, "id">) })));
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const addPayment = async (amount: number, note: string, date: string) => {
    await addDoc(collection(db, COLLECTION), { amount, note, date });
  };

  const deletePayment = async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f1117" }}>
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <><Toaster position="top-right" toastOptions={toastStyle} /><Login /></>;

  return (
    <>
      <Toaster position="top-right" toastOptions={toastStyle} />
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f1117 0%, #141824 50%, #0f1117 100%)" }}>
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #6366f1 50%, transparent)" }} />

        <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
          <header className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
                  <span className="text-xs">🤝</span>
                </div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Orthomar ERP</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Paiements Associée</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400">{user.displayName || user.email}</p>
                <p className="text-xs text-slate-600">connecté</p>
              </div>
              <button
                onClick={() => signOut(auth)}
                title="Se déconnecter"
                className="p-2 rounded-xl bg-white/4 hover:bg-white/8 border border-white/8 text-slate-400 hover:text-white transition-all"
              >
                <HiArrowRightOnRectangle className="text-lg" />
              </button>
            </div>
          </header>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <Dashboard payments={payments} />
              <AddPayment onAdd={addPayment} />
              <PaymentList payments={payments} onDelete={deletePayment} />
            </>
          )}
        </div>
      </div>
    </>
  );
}