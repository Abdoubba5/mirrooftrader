"use client";

import { useState } from "react";
import { t, Lang } from "../lib/i18n";

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("ar");
  const txt = t(lang);

  const shadows =
    lang === "ar"
      ? [
          { title: "ظل الخوف", desc: "يُغلق صفقاتك قبل أن تنضج." },
          { title: "ظل الطمع", desc: "يجعلك تريد المزيد حتى بعد الربح." },
          { title: "ظل الجشع", desc: "يدفعك للمخاطرة دون حدود." },
          { title: "ظل مال المتداول", desc: "يحَوّل المال إلى ضغط نفسي وقرار." },
        ]
      : [
          { title: "Fear Shadow", desc: "Closes your trades too early." },
          { title: "Greed Shadow", desc: "Makes you want more after profit." },
          { title: "Avarice Shadow", desc: "Pushes risk beyond limits." },
          { title: "Money Shadow", desc: "Turns money into psychological pressure." },
        ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 22 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <b style={{ fontSize: 18 }}>{txt.brand}</b>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/store">{txt.store}</a>
          <a href="/login">{txt.login}</a>
          <button onClick={() => setLang((p) => (p === "ar" ? "en" : "ar"))} style={{ cursor: "pointer" }}>
            {lang === "ar" ? "AR ✅ / EN" : "AR / EN ✅"}
          </button>
<footer style={{ marginTop: 30, paddingBottom: 30, opacity: 0.8, fontSize: 13 }}>
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
    <a href="/terms">📜 Terms</a>
    <a href="/privacy">🔒 Privacy</a>
    <a href="/contact">📩 Contact</a>
  </div>

  <div style={{ marginTop: 10 }}>
    © {new Date().getFullYear()} MirroOfTrader — Written by Sidi Ali Abdel-Ilah — All rights reserved.
  </div>
</footer>

        </div>
      </header>

      <section style={{ border: "1px solid #ddd", borderRadius: 16, padding: 22, marginTop: 14 }}>
        <h1 style={{ fontSize: 42, margin: 0 }}>{txt.home_title}</h1>
        <p style={{ opacity: 0.8, marginTop: 10 }}>{txt.home_sub}</p>

        <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
          <a href="/login" style={{ padding: "12px 16px", border: "1px solid #111", borderRadius: 12, fontWeight: 800 }}>
            📖 {txt.start_reading}
          </a>
          <a href="/store" style={{ padding: "12px 16px", border: "1px solid #ddd", borderRadius: 12, fontWeight: 800 }}>
            🛒 {txt.get_access}
          </a>
          <a href="/shadow-test" style={{ padding: "12px 16px", border: "1px solid #ddd", borderRadius: 12, fontWeight: 800 }}>
            🧠 {txt.test}
          </a>
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 22 }}>{lang === "ar" ? "الظلال الأربعة" : "The Four Shadows"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {shadows.map((s) => (
            <div key={s.title} style={{ border: "1px solid #ddd", borderRadius: 14, padding: 14 }}>
              <b>{s.title}</b>
              <p style={{ opacity: 0.85, marginTop: 8 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ marginTop: 30, paddingBottom: 30, opacity: 0.75, fontSize: 13 }}>
        © {new Date().getFullYear()} MirroOfTrader — Written by Sidi Ali Abdel-Ilah — All rights reserved.
      </footer>
    </div>
  );
}



