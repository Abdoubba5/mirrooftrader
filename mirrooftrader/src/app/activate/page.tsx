"use client";

import { useState } from "react";
import { doc, runTransaction } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function ActivatePage() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const activate = async () => {
    setMsg("");

    try {
      const clean = code.trim().toUpperCase();

      await runTransaction(db, async (tx) => {
        const codeRef = doc(db, "codes", clean);
        const codeSnap = await tx.get(codeRef);

        if (!codeSnap.exists()) throw new Error("CODE_NOT_FOUND");

        const data = codeSnap.data() as any;
        if (data.used) throw new Error("CODE_USED");

        tx.update(codeRef, { used: true, usedAt: Date.now() });
      });

      setMsg("✅ تم التفعيل بنجاح");
    } catch (e: any) {
      setMsg("❌ كود غير صالح أو مستعمل");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "60px auto", padding: 20 }}>
      <h1>✅ تفعيل الحساب</h1>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="ضع كود التفعيل"
        style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
      />

      <button
        onClick={activate}
        style={{ marginTop: 12, padding: 12, borderRadius: 12, border: "none", cursor: "pointer" }}
      >
        تفعيل
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
