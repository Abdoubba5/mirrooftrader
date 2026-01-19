"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";

type Chapter = {
  id: string;
  order: number;
  slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
};

type UserDoc = {
  active: boolean;
  expiresAt: number | null;
  publicId: string;
  role: "user" | "admin";
};

function chunkWatermarkText(text: string, wm: string) {
  const parts = text.split("\n\n");
  const result: string[] = [];
  for (const p of parts) {
    const clean = p.trim();
    if (!clean) continue;
    result.push(clean);
    result.push(`\n\n— ${wm} —\n\n`);
  }
  return result.join("");
}

export default function ReaderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("c");

  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [dark, setDark] = useState(true);

  // ✅ Fonts premium
  const [font, setFont] = useState<"tajawal" | "cairo" | "amiri">("tajawal");

  // ✅ Strong protection
  const [antiCopy] = useState(true);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  // ✅ Moving watermark
  const [wmPos, setWmPos] = useState<{ x: number; y: number }>({ x: 18, y: 18 });
  const [wmCorner, setWmCorner] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      const userRef = doc(db, "users", u.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        setStatusMsg("حسابك غير مكتمل | Account is not ready");
        setLoading(false);
        return;
      }

      const ud = snap.data() as UserDoc;
      setUserDoc(ud);

      const now = Date.now();
      const expired = ud.expiresAt !== null && now > ud.expiresAt;
      const active = ud.active && !expired;

      if (!active) {
        setStatusMsg("حسابك غير مفعل | Inactive account");
        setLoading(false);
        return;
      }

      const q = query(collection(db, "chapters"), orderBy("order", "asc"));
      const list = await getDocs(q);

      const items: Chapter[] = list.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          order: data.order,
          slug: data.slug,
          title_ar: data.title_ar,
          title_en: data.title_en,
          content_ar: data.content_ar,
          content_en: data.content_en,
        };
      });

      setChapters(items);

      if (items.length) {
        const found = initial ? items.find((x) => x.slug === initial) : null;
        setCurrentId(found?.id ?? items[0].id);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router, initial]);

  const current = useMemo(() => {
    if (!currentId) return null;
    return chapters.find((c) => c.id === currentId) ?? null;
  }, [chapters, currentId]);

  const currentIndex = useMemo(() => {
    if (!current) return -1;
    return chapters.findIndex((c) => c.id === current.id);
  }, [chapters, current]);

  function goPrev() {
    if (currentIndex <= 0) return;
    setCurrentId(chapters[currentIndex - 1].id);
  }

  function goNext() {
    if (currentIndex < 0 || currentIndex >= chapters.length - 1) return;
    setCurrentId(chapters[currentIndex + 1].id);
  }

  // ✅ Save last read
  useEffect(() => {
    async function saveLastRead() {
      const u = auth.currentUser;
      if (!u || !current) return;

      await updateDoc(doc(db, "users", u.uid), {
        lastRead: { slug: current.slug },
        lastReadAt: Date.now(),
      });
    }
    saveLastRead();
  }, [current?.slug]);

  const watermarkLabel = useMemo(() => {
    const id = userDoc?.publicId ?? "unknown";
    const d = new Date().toLocaleDateString();
    return `MirroOfTrader • ID:${id} • ${d}`;
  }, [userDoc?.publicId]);

  const finalText = useMemo(() => {
    if (!current) return "";
    const base = lang === "ar" ? current.content_ar : current.content_en;
    return chunkWatermarkText(base, watermarkLabel);
  }, [current, lang, watermarkLabel]);

  // ✅ Moving watermark every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setWmCorner((prev) => ((prev + 1) % 4) as 0 | 1 | 2 | 3);
      const randX = Math.floor(Math.random() * 40);
      const randY = Math.floor(Math.random() * 40);
      setWmPos({ x: 18 + randX, y: 18 + randY });
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  // ✅ Anti-copy protection
  useEffect(() => {
    if (!antiCopy) return;

    const disableContext = (e: MouseEvent) => e.preventDefault();
    const disableCopy = (e: ClipboardEvent) => e.preventDefault();
    const disableDrag = (e: DragEvent) => e.preventDefault();
    const disableSelectStart = (e: Event) => e.preventDefault();

    document.addEventListener("contextmenu", disableContext);
    document.addEventListener("copy", disableCopy);
    document.addEventListener("cut", disableCopy);
    document.addEventListener("dragstart", disableDrag);
    document.addEventListener("selectstart", disableSelectStart);

    return () => {
      document.removeEventListener("contextmenu", disableContext);
      document.removeEventListener("copy", disableCopy);
      document.removeEventListener("cut", disableCopy);
      document.removeEventListener("dragstart", disableDrag);
      document.removeEventListener("selectstart", disableSelectStart);
    };
  }, [antiCopy]);

  useEffect(() => {
    if (!antiCopy) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if ((e.ctrlKey || e.metaKey) && key === "c") e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && key === "a") e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && key === "s") e.preventDefault();
      if (key === "printscreen") e.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [antiCopy]);

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  if (statusMsg) {
    return (
      <div style={{ maxWidth: 700, margin: "60px auto", padding: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900 }}>Reader</h1>
        <p style={{ marginTop: 10 }}>{statusMsg}</p>
        <div style={{ marginTop: 14 }}>
          <a href="/activate">🎟 تفعيل كود | Activate code</a>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div style={{ padding: 24 }}>
        <p>No content yet</p>
      </div>
    );
  }

  const wmStyleCorner =
    wmCorner === 0
      ? { left: wmPos.x, top: wmPos.y }
      : wmCorner === 1
      ? { right: wmPos.x, top: wmPos.y }
      : wmCorner === 2
      ? { right: wmPos.x, bottom: wmPos.y }
      : { left: wmPos.x, bottom: wmPos.y };

  const fontFamily =
    font === "tajawal"
      ? "Tajawal, system-ui"
      : font === "cairo"
      ? "Cairo, system-ui"
      : "Amiri, serif";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: 18,
        maxWidth: 1200,
        margin: "30px auto",
        padding: 18,
      }}
    >
      {/* ✅ Moving Watermark Overlay */}
      <div
        style={{
          position: "fixed",
          zIndex: 9999,
          opacity: dark ? 0.18 : 0.12,
          fontSize: 12,
          fontWeight: 900,
          pointerEvents: "none",
          userSelect: "none",
          color: dark ? "#ffffff" : "#000000",
          background: dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.55)",
          padding: "10px 12px",
          borderRadius: 12,
          border: dark
            ? "1px solid rgba(255,255,255,0.15)"
            : "1px solid rgba(0,0,0,0.08)",
          backdropFilter: "blur(6px)",
          transition: "all 0.8s ease",
          ...wmStyleCorner,
        }}
      >
        <div>MirroOfTrader</div>
        <div>ID: {userDoc?.publicId ?? "unknown"}</div>
        <div>{new Date().toLocaleDateString()}</div>
      </div>

      <aside
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 14,
          height: "calc(100vh - 80px)",
          overflow: "auto",
          background: dark ? "#0b0b0f" : "white",
          color: dark ? "#eaeaea" : "#111",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <b>📚 TOC</b>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setLang((p) => (p === "ar" ? "en" : "ar"))}>
              {lang === "ar" ? "AR ✅" : "EN ✅"}
            </button>

            <button onClick={() => setDark((p) => !p)}>{dark ? "🌙" : "☀️"}</button>

            <select
              value={font}
              onChange={(e) => setFont(e.target.value as any)}
              style={{
                padding: "6px 8px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: dark ? "#111827" : "white",
                color: dark ? "#eaeaea" : "#111",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              <option value="tajawal">Tajawal</option>
              <option value="cairo">Cairo</option>
              <option value="amiri">Amiri</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12, opacity: 0.85 }}>
          ID: <b>{userDoc?.publicId}</b>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setCurrentId(ch.id)}
              style={{
                textAlign: "left",
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                cursor: "pointer",
                background:
                  ch.id === currentId ? (dark ? "#111827" : "#f5f5f5") : "transparent",
                color: dark ? "#eaeaea" : "#111",
              }}
            >
              <div style={{ fontWeight: 800 }}>
                {lang === "ar" ? ch.title_ar : ch.title_en}
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                #{ch.order} • {ch.slug}
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <a href="/dashboard" style={{ color: dark ? "#eaeaea" : "#111" }}>
            ← Dashboard
          </a>
        </div>
      </aside>

      <main
        style={{
          position: "relative",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 22,
          height: "calc(100vh - 80px)",
          overflow: "auto",
          background: dark ? "#0b0b0f" : "white",
          color: dark ? "#eaeaea" : "#111",
        }}
      >
        {/* ✅ Big Watermark */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "48%",
            transform: "translate(-50%, -50%) rotate(-18deg)",
            opacity: dark ? 0.06 : 0.04,
            fontSize: 46,
            fontWeight: 900,
            letterSpacing: 2,
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          {userDoc?.publicId ?? "MirroOfTrader"}
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, marginTop: 0 }}>
          {lang === "ar" ? current.title_ar : current.title_en}
        </h1>

        <div style={{ opacity: 0.7, marginTop: 4, fontSize: 13 }}>
          {watermarkLabel}
        </div>

        <article
          style={{
            position: "relative",
            marginTop: 18,
            lineHeight: 1.9,
            fontSize: 16,
            direction: lang === "ar" ? "rtl" : "ltr",
            whiteSpace: "pre-wrap",
            userSelect: antiCopy ? "none" : "text",
            WebkitUserSelect: antiCopy ? "none" : "text",
            fontFamily,
          }}
        >
          {finalText}
        </article>

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button onClick={goPrev} disabled={currentIndex <= 0}>
            ◀ Prev
          </button>
          <button onClick={goNext} disabled={currentIndex >= chapters.length - 1}>
            Next ▶
          </button>
        </div>

        {/* ✅ Copyright from your book */}
        <div
          style={{
            marginTop: 18,
            padding: 12,
            borderRadius: 12,
            border: dark
              ? "1px solid rgba(255,255,255,0.14)"
              : "1px solid rgba(0,0,0,0.10)",
            opacity: 0.85,
            fontSize: 13,
          }}
        >
          {lang === "ar"
            ? "© جميع الحقوق محفوظة — يمنع النسخ أو إعادة النشر."
            : "© All rights reserved — No copying or republication permitted."}
        </div>
      </main>
    </div>
  );
}
