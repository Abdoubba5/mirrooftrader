"use client";

import { useState } from "react";

export default function ContactPage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");

  // ✅ ضع روابطك هنا (عدّلهم كما تحب)
  const WHATSAPP = "https://wa.me/213000000000"; // <-- غيّر الرقم
  const TELEGRAM = "https://t.me/your_username"; // <-- غيّر المعرف
  const EMAIL = "mailto:support@mirrooftrader.com"; // <-- غيّر الإيميل

  return (
    <div style={{ maxWidth: 900, margin: "50px auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h1 style={{ margin: 0 }}>
          {lang === "ar" ? "📩 اتصل بنا" : "📩 Contact Us"}
        </h1>

        <button onClick={() => setLang((p) => (p === "ar" ? "en" : "ar"))} style={{ cursor: "pointer" }}>
          {lang === "ar" ? "AR ✅ / EN" : "AR / EN ✅"}
        </button>
      </div>

      <p style={{ opacity: 0.85, marginTop: 12 }}>
        {lang === "ar"
          ? "لشراء بطاقة التفعيل أو دعم الحساب تواصل معنا عبر:"
          : "For activation card purchase or account support, contact us via:"}
      </p>

      <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
        <a
          href={WHATSAPP}
          target="_blank"
          style={{
            border: "1px solid #ddd",
            borderRadius: 14,
            padding: 14,
            fontWeight: 900,
          }}
        >
          💬 WhatsApp
        </a>

        <a
          href={TELEGRAM}
          target="_blank"
          style={{
            border: "1px solid #ddd",
            borderRadius: 14,
            padding: 14,
            fontWeight: 900,
          }}
        >
          ✈️ Telegram
        </a>

        <a
          href={EMAIL}
          style={{
            border: "1px solid #ddd",
            borderRadius: 14,
            padding: 14,
            fontWeight: 900,
          }}
        >
          📧 Email
        </a>
      </div>

      <div style={{ marginTop: 18 }}>
        <a href="/">← {lang === "ar" ? "الرئيسية" : "Home"}</a>
      </div>
    </div>
  );
}
