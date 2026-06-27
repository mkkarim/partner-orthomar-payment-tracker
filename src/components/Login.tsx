import { useState } from "react";
import { signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { HiLockClosed } from "react-icons/hi2";

// 👇 Ton email autorisé
const ALLOWED_EMAIL = "karimmaitig98@gmail.com";

export default function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [mode,     setMode]     = useState<"google" | "email">("google");

  const loginGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== ALLOWED_EMAIL) {
        await signOut(auth);
        toast.error("Accès non autorisé");
        return;
      }
      toast.success("Connecté !");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        toast.error("Erreur de connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  const loginEmail = async () => {
    if (!email || !password) { toast.error("Remplis tous les champs"); return; }
    // Vérification email autorisé avant même d'essayer Firebase
    if (email.trim().toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
      toast.error("Accès non autorisé");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast.success("Connecté !");
    } catch (err: any) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        toast.error("Mot de passe incorrect");
      } else if (err.code === "auth/user-not-found") {
        toast.error("Utilisateur introuvable");
      } else {
        toast.error("Erreur de connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0f1117 0%, #141824 50%, #0f1117 100%)" }}
    >
      <div className="fixed top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #6366f1 50%, transparent)" }} />

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
            <HiLockClosed className="text-white text-xl" />
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Orthomar ERP</p>
          <h1 className="text-2xl font-bold text-white">Payment Tracker</h1>
          <p className="text-sm text-slate-500 mt-1">Accès privé</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-6 space-y-3">

          {/* Toggle mode */}
          <div className="flex rounded-xl bg-white/4 p-1 gap-1 mb-4">
            <button
              onClick={() => setMode("google")}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                mode === "google"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setMode("email")}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                mode === "email"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Email
            </button>
          </div>

          {mode === "google" ? (
            <button
              onClick={loginGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white/6 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl text-sm font-medium transition-all active:scale-95 disabled:opacity-40"
            >
              <FcGoogle className="text-xl" />
              {loading ? "Connexion…" : "Continuer avec Google"}
            </button>
          ) : (
            <>
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loginEmail()}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loginEmail()}
              />
              <button
                onClick={loginEmail}
                disabled={loading || !email || !password}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium text-sm transition-all active:scale-95"
              >
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}