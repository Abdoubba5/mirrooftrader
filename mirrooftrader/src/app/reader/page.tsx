"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

type Chapter = {
  id: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  order: number;
};

export default function ReaderPage() {
  const [user, setUser] = useState<any>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, "chapters"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const list: Chapter[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setChapters(list);
      if (list.length) setSelected(list[0].id);
    };
    load();
  }, []);

  if (!user) {
    return (
      <div style={{ padding: 24 }}>
        <h2>🔐 لازم تسجل دخول</h2>
        <a href="/login">اذهب لتسجيل الدخول</a>
      </div>
    );
  }

  const current = chapters.find((c) => c.id === selected);

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h1 style={{ margin: 0 }}>{lang === "ar" ? "📖 القارئ" : "📖 Reader"}</h1>
        <button onClick={() => setLang((p) => (p === "ar" ? "en" : "ar"))}>
          {lang === "ar" ? "AR ✅ / EN" : "AR / EN ✅"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
          <h3>{lang === "ar" ? "الفصول" : "Chapters"}</h3>
          {chapters.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: 10,
                marginBottom: 8,
                borderRadius: 10,
                cursor: "pointer",
                border: selected === c.id ? "2px solid #111" : "1px solid #ddd",
                background: "white",
              }}
            >
              {lang === "ar" ? c.title_ar : c.title_en}
            </button>
          ))}
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 18 }}>
          {!current ? (
            <p>{lang === "ar" ? "اختر فصل" : "Select a chapter"}</p>
          ) : (
            <>
              <h2 style={{ marginTop: 0 }}>{lang === "ar" ? current.title_ar : current.title_en}</h2>
              <div style={{ lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                {lang === "ar" ? current.content_ar : current.content_en}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
