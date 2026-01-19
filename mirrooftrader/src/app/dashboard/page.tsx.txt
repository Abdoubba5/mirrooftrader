"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

type UserDoc = {
  active: boolean;
  expiresAt: number | null;
  publicId: string;
  role: "user" | "admin";
  lastRead?: { slug: string } | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setUserDoc(null);
      } else {
        setUserDoc(snap.data() as UserDoc);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  if (!userDoc) {
    return (
      <div style={{ padding: 24 }}>
        <h2>حسابك غير مكتمل</h2>
        <p>اتصل بالإدارة لإنشاء بياناتك.</p>
      </div>
    );
  }

  const now = Date.now();
  const isExpired = userDoc.expiresAt !== null && now > userDoc.expiresAt;
  const isActive = userDoc.active && !isExpired;

  return (
    <div style={{ maxWidth: 800, margin: "50px auto", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900 }}>لوحة المستخدم | Dashboard</h1>

      <p style={{ opacity: 0.85 }}>
        ID: <b>{userDoc.publicId}</b>
      </p>

      <div style={{ marginTop: 14, padding: 14, border: "1px solid #ddd", borderRadius: 14 }}>
        <p style={{ margin: 0 }}>
          الحالة | Status:{" "}
          <b style={{ color: isActive ? "green" : "crimson" }}>
            {isActive ? "مفعّل | Active" : "غير مفعّل | Inactive"}
          </b>
        </p>

        {!isActive && (
          <div style={{ marginTop: 10 }}>
            <a href="/activate">🎟 فعّل حسابك الآن | Activate now</a>
          </div>
        )}
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/reader">📖 قراءة الكتاب | Read</a>

        {userDoc.lastRead?.slug && (
          <a href={`/reader?c=${userDoc.lastRead.slug}`}>▶️ أكمل القراءة | Continue</a>
        )}

        <a href="/shadow-test">🧠 اختبار الظل | Shadow Test</a>
        <a href="/store">🛒 المتجر | Store</a>
      </div>

      {userDoc.role === "admin" && (
        <div style={{ marginTop: 18 }}>
          <a href="/admin">👑 لوحة الإدارة | Admin</a>
        </div>
      )}

      <button
        onClick={async () => {
          await signOut(auth);
          router.push("/login");
        }}
        style={{
          marginTop: 22,
          padding: "10px 14px",
          borderRadius: 12,
          cursor: "pointer",
          fontWeight: 900,
          border: "1px solid #ddd",
        }}
      >
        🚪 تسجيل الخروج | Logout
      </button>
    </div>
  );
}
