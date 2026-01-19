"use client";

import { useState } from "react";

export default function PrivacyPage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");

  return (
    <div style={{ maxWidth: 900, margin: "50px auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h1 style={{ margin: 0 }}>
          {lang === "ar" ? "🔒 سياسة الخصوصية" : "🔒 Privacy Policy"}
        </h1>

        <button onClick={() => setLang((p) => (p === "ar" ? "en" : "ar"))} style={{ cursor: "pointer" }}>
          {lang === "ar" ? "AR ✅ / EN" : "AR / EN ✅"}
        </button>
      </div>

      {lang === "ar" ? (
        <>
          <p style={{ opacity: 0.85, marginTop: 12 }}>
            نحن نحترم خصوصيتك في <b>MirroOfTrader</b>.
          </p>

          <h2>1) البيانات التي نجمعها</h2>
          <ul>
            <li>بيانات الدخول (ID) عبر نظام تسجيل Firebase.</li>
            <li>حالة التفعيل وتاريخ انتهاء الاشتراك (expiresAt).</li>
            <li>آخر فصل تمت قراءته (lastRead) لتحسين تجربة القراءة.</li>
          </ul>

          <h2>2) كيف نستخدم البيانات؟</h2>
          <ul>
            <li>لتوفير الوصول للقارئ حسب التفعيل.</li>
            <li>لحماية المحتوى ومنع التسريب.</li>
            <li>لتحسين تجربة المستخدم.</li>
          </ul>

          <h2>3) مشاركة البيانات</h2>
          <p style={{ opacity: 0.9 }}>
            لا نبيع بياناتك ولا نشاركها مع أطراف خارجية إلا عند الضرورة القانونية.
          </p>

          <h2>4) حماية المحتوى</h2>
          <p style={{ opacity: 0.9 }}>
            قد يتم عرض معرف المستخدم (ID) داخل القارئ كعلامة حماية (Watermark) لمنع تسريب المحتوى.
          </p>

          <h2>5) طلب حذف الحساب</h2>
          <p style={{ opacity: 0.9 }}>
            يمكنك طلب حذف حسابك بالتواصل معنا عبر صفحة “اتصل بنا”.
          </p>
        </>
      ) : (
        <>
          <p style={{ opacity: 0.85, marginTop: 12 }}>
            We respect your privacy at <b>MirroOfTrader</b>.
          </p>

          <h2>1) Data We Collect</h2>
          <ul>
            <li>Login identifier (ID) via Firebase authentication.</li>
            <li>Activation status and expiry date (expiresAt).</li>
            <li>Last read chapter (lastRead) for better reading experience.</li>
          </ul>

          <h2>2) How We Use Data</h2>
          <ul>
            <li>To provide access based on activation.</li>
            <li>To protect the book content and prevent leaks.</li>
            <li>To improve the user experience.</li>
          </ul>

          <h2>3) Sharing</h2>
          <p style={{ opacity: 0.9 }}>
            We do not sell your data. We only share it if legally required.
          </p>

          <h2>4) Content Protection</h2>
          <p style={{ opacity: 0.9 }}>
            Your user ID may appear as a watermark inside the reader to protect content ownership.
          </p>

          <h2>5) Account Deletion</h2>
          <p style={{ opacity: 0.9 }}>
            You can request account deletion by contacting us via the Contact page.
          </p>
        </>
      )}

      <div style={{ marginTop: 18 }}>
        <a href="/">← {lang === "ar" ? "الرئيسية" : "Home"}</a>
      </div>
    </div>
  );
}
