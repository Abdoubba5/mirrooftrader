"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ActivatePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
    });
    return () => unsub();
  }, [router]);

  async function handleActivate() {
    setMsg("");
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      const clean = code.trim().toUpperCase();

      await runTransaction(db, async (tx) => {
        const codeRef = doc(db, "codes", clean);
        const codeSnap = await tx.get(codeRef);

        if (!codeSnap.exists()) throw new Error("CODE_NOT_FOUND");

        const data = codeSnap.data() as any;
        if (data.used) throw new Error("CODE_USED");

        const userRef = doc(db, "users", user.uid);
        const userSnap = await tx.get(userRef);
        if (!userSnap.exists()) throw new Error("USER_DOC_MISSING");

        const durationDays = data.durationDays as number;
        const now = Date.now();
        const expiresAt =
          durationDays >= 99999 ? null : now + durationDays * 24 * 60 * 60 * 1000;

        tx.update(codeRef, { used: true, usedBy: user.uid });
        tx.update(userRef, { active: true, expiresAt });
      });

      setMsg("✅ تم تفعيل حسابك بنجاح | Activated successfully");
      setTimeout(() => router.push("/reader"), 800);
    } catch (e: any) {
      const m =
        e.message === "CODE_NOT_FOUND"
          ? "الكود غير موجود | Code not found"
          : e.message === "CODE_USED"
          ? "الكود مستعمل | Code already used"
          : "حدث خطأ | Something went wrong";
      setMsg("❌ " + m);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "60px auto", padding: 20 }}>
      <h1 style={{ fontSize: 26, fontWeight: 900 }}>🎟 تفعيل الكود | Activate</h1>

      <p style={{ opacity: 0.75, marginTop: 8 }}>
        أدخل كود التفعيل الذي أعطاه لك الأدمن.
      </p>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: "100%", padding: 12, marginTop: 14 }}
        placeholder="مثال: MTR-ABCD-1234"
      />

      <button
        onClick={handleActivate}
        disabled={loading}
        style={{
          width: "100%",
          marginTop: 14,
          padding: 12,
          fontWeight: 900,
          cursor: "pointer",
          borderRadius: 12,
          border: "1px solid #ddd",
        }}
      >
        {loading ? "..." : "تفعيل | Activate"}
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      <div style={{ marginTop: 14 }}>
        <a href="/dashboard">← Dashboard</a>
      </div>
    </div>
  );
}
