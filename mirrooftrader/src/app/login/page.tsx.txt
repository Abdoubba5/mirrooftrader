"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [publicId, setPublicId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const email = `${publicId.trim().toLowerCase()}@mirrooftrader.com`;

      // ✅ Session expires when browser closes
      await setPersistence(auth, browserSessionPersistence);

      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch {
      setErr("بيانات الدخول غير صحيحة | Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900 }}>MirroOfTrader</h1>
      <p style={{ opacity: 0.8 }}>تسجيل الدخول | Login</p>

      <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
        <label>ID</label>
        <input
          value={publicId}
          onChange={(e) => setPublicId(e.target.value)}
          style={{ width: "100%", padding: 12, marginTop: 6, marginBottom: 12 }}
          placeholder="مثال: trader001"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 12, marginTop: 6 }}
          placeholder="••••••••"
        />

        {err && <p style={{ color: "crimson", marginTop: 12 }}>{err}</p>}

        <button disabled={loading} style={{ width: "100%", marginTop: 16, padding: 12, fontWeight: 900 }}>
          {loading ? "..." : "دخول | Login"}
        </button>
      </form>

      <div style={{ marginTop: 14 }}>
        <a href="/activate">تفعيل كود | Activate code</a>
      </div>
    </div>
  );
}
