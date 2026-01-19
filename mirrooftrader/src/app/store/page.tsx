"use client";

import { useState } from "react";

export default function StorePage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");

  const plans =
    lang === "ar"
      ? [
          { name: "بطاقة أسبوع", days: 7, price: "5$" },
          { name: "بطاقة شهر", days: 30, price: "15$" },
          { name: "بطاقة مدى الحياة", days: 99999, price: "49$" },
        ]
      : [
          { name: "7 Days Access", days: 7, price: "$5" },
          { name: "30 Days Access", days: 30, price: "$15" },
          { name: "Lifetime Access", days: 99999, price: "$49" },
        ];

  return (
    <div style={{ maxWidth: 900, margin: "60px auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h1 style={{ margin: 0 }}>🛒 {lang === "ar" ? "المتجر" : "Store"}</h1>

        <button onClick={() => setLang((p) => (p === "ar" ? "en" : "ar"))} style={{ cursor: "pointer" }}>
          {lang === "ar" ? "AR ✅ / EN" : "AR / EN ✅"}
        </button>
      </div>

      <p style={{ opacity: 0.8, marginTop: 10 }}>
        {lang === "ar"
          ? "الشراء يدويًا: بعد الدفع سيتم إرسال كود التفعيل لك من الإدارة."
          : "Manual purchase: after payment, admin will send your activation code."}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        {plans.map((p) => (
          <div key={p.name} style={{ border: "1px solid #ddd", borderRadius: 16, padding: 16 }}>
            <b style={{ fontSize: 18 }}>{p.name}</b>

            <p style={{ opacity: 0.85, marginTop: 10 }}>
              {lang === "ar" ? "السعر: " : "Price: "} <b>{p.price}</b>
            </p>

            <p style={{ opacity: 0.75 }}>
              {p.days >= 99999
                ? lang === "ar"
                  ? "دخول مدى الحياة"
                  : "Lifetime access"
                : lang === "ar"
                ? `صلاحية ${p.days} يوم`
                : `Valid for ${p.days} days`}
            </p>

            <div style={{ marginTop: 12 }}>
              <a
                href="/login"
                style={{
                  display: "inline-block",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid #111",
                  fontWeight: 900,
                }}
              >
                {lang === "ar" ? "اطلب البطاقة" : "Request Access"}
              </a>
            </div>

            <p style={{ fontSize: 12, opacity: 0.7, marginTop: 12 }}>
              {lang === "ar"
                ? "تواصل مع الإدارة لإتمام الدفع واستلام الكود."
                : "Contact admin to complete payment and receive the code."}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <a href="/">{lang === "ar" ? "← الرئيسية" : "← Home"}</a>
      </div>
    </div>
  );
}
