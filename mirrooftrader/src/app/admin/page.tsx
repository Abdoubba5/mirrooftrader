"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

type UserDoc = { role: "user" | "admin" };

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [msg, setMsg] = useState("");
  const [publicId, setPublicId] = useState("");
  const [password, setPassword] = useState("");

  const [days, setDays] = useState<number>(30);
  const [createdCode, setCreatedCode] = useState<string>("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        router.push("/dashboard");
        return;
      }

      const ud = snap.data() as UserDoc;
      if (ud.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setAllowed(true);
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  async function createUser() {
    setMsg("");
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId, password }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      setMsg("✅ تم إنشاء المستخدم");
      setPublicId("");
      setPassword("");
    } catch {
      setMsg("❌ فشل إنشاء المستخدم");
    }
  }

  async function createCode() {
    setMsg("");
    try {
      const res = await fetch("/api/admin/create-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durationDays: days }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      setCreatedCode(data.code);
      setMsg("✅ تم إنشاء كود");
    } catch {
      setMsg("❌ فشل إنشاء الكود");
    }
  }

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!allowed) return null;

  return (
    <div style={{ maxWidth: 900, margin: "50px auto", padding: 20 }}>
      <h1 style={{ marginTop: 0 }}>👑 Admin Panel</h1>
      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}

      <div style={{ border: "1px solid #ddd", borderRadius: 14, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>إنشاء مستخدم جديد</h2>

        <input
          value={publicId}
          onChange={(e) => setPublicId(e.target.value)}
          placeholder="public ID (مثال: trader001)"
          style={{ width: "100%", padding: 12, marginTop: 10 }}
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password (>= 6)"
          style={{ width: "100%", padding: 12, marginTop: 10 }}
          type="password"
        />

        <button
          onClick={createUser}
          style={{
            marginTop: 12,
            padding: 12,
            fontWeight: 900,
            cursor: "pointer",
            borderRadius: 12,
            border: "1px solid #ddd",
          }}
        >
          إنشاء المستخدم
        </button>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 14, padding: 16, marginTop: 14 }}>
        <h2 style={{ marginTop: 0 }}>إنشاء كود تفعيل</h2>

        <label>مدة الكود (بالأيام)</label>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={{ display: "block", padding: 10, marginTop: 8 }}
        >
          <option value={7}>7 أيام</option>
          <option value={30}>30 يوم</option>
          <option value={99999}>مدى الحياة</option>
        </select>

        <button
          onClick={createCode}
          style={{
            marginTop: 12,
            padding: 12,
            fontWeight: 900,
            cursor: "pointer",
            borderRadius: 12,
            border: "1px solid #ddd",
          }}
        >
          إنشاء كود
        </button>

        {createdCode && (
          <div style={{ marginTop: 12, padding: 12, background: "#f7f7f7", borderRadius: 12 }}>
            <b>الكود:</b> {createdCode}
          </div>
        )}
      </div>

      <div style={{ marginTop: 18 }}>
        <a href="/dashboard">← Dashboard</a>
      </div>
    </div>
  );
}


