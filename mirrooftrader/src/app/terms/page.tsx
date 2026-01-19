"use client";

import { useState } from "react";

export default function TermsPage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");

  return (
    <div style={{ maxWidth: 900, margin: "50px auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h1 style={{ margin: 0 }}>
          {lang === "ar" ? "📜 شروط الاستخدام" : "📜 Terms of Use"}
        </h1>

        <button onClick={() => setLang((p) => (p === "ar" ? "en" : "ar"))} style={{ cursor: "pointer" }}>
          {lang === "ar" ? "AR ✅ / EN" : "AR / EN ✅"}
        </button>
      </div>

      {lang === "ar" ? (
        <>
          <p style={{ opacity: 0.85, marginTop: 12 }}>
            مرحبًا بك في <b>MirroOfTrader</b>. باستخدامك لهذا الموقع أنت توافق على هذه الشروط.
          </p>

          <h2>1) الملكية الفكرية</h2>
          <p style={{ opacity: 0.9 }}>
            جميع محتويات الكتاب والنصوص داخل القارئ هي ملك للمؤلف.
            يمنع نسخ أو إعادة نشر أو توزيع أي جزء بدون إذن كتابي مسبق.
          </p>

          <h2>2) الحسابات والوصول</h2>
          <ul>
            <li>الدخول يتم عبر ID + Password يقدمه الأدمن.</li>
            <li>كل مستخدم مسؤول عن حماية بيانات دخوله وعدم مشاركتها.</li>
            <li>أي مشاركة للحساب قد تؤدي لإيقافه بدون تعويض.</li>
          </ul>

          <h2>3) التفعيل بالكود</h2>
          <ul>
            <li>الكود يمنح مدة دخول حسب نوع البطاقة.</li>
            <li>الكود يستخدم مرة واحدة فقط.</li>
          </ul>

          <h2>4) الاستخدام المقبول</h2>
          <ul>
            <li>يمنع محاولة استخراج المحتوى أو تصويره أو إعادة توزيعه.</li>
            <li>يمنع أي محاولة اختراق أو تعطيل خدمات الموقع.</li>
          </ul>

          <h2>5) المسؤولية</h2>
          <p style={{ opacity: 0.9 }}>
            هذا الكتاب محتوى نفسي/فلسفي للتوعية ولا يعتبر نصيحة مالية أو توصيات تداول.
            المستخدم مسؤول عن قراراته.
          </p>

          <h2>6) تحديث الشروط</h2>
          <p style={{ opacity: 0.9 }}>
            قد نقوم بتحديث الشروط من وقت لآخر. استمرارك باستخدام الموقع يعني قبولك للتحديثات.
          </p>
        </>
      ) : (
        <>
          <p style={{ opacity: 0.85, marginTop: 12 }}>
            Welcome to <b>MirroOfTrader</b>. By using this website you agree to these terms.
          </p>

          <h2>1) Intellectual Property</h2>
          <p style={{ opacity: 0.9 }}>
            All book content and reading materials are owned by the author.
            No copying, republication, or redistribution is permitted without written permission.
          </p>

          <h2>2) Accounts & Access</h2>
          <ul>
            <li>Access is provided via an admin-issued ID + password.</li>
            <li>Users are responsible for keeping their credentials private.</li>
            <li>Sharing accounts may result in suspension without refund.</li>
          </ul>

          <h2>3) Activation Codes</h2>
          <ul>
            <li>Codes grant access duration based on your plan.</li>
            <li>Each code can be used only once.</li>
          </ul>

          <h2>4) Acceptable Use</h2>
          <ul>
            <li>No attempts to extract, record, or redistribute the content.</li>
            <li>No hacking, abuse, or disruption of the service.</li>
          </ul>

          <h2>5) Disclaimer</h2>
          <p style={{ opacity: 0.9 }}>
            This is a psychological/philosophical educational book and is not financial advice.
            You are responsible for your decisions.
          </p>

          <h2>6) Updates</h2>
          <p style={{ opacity: 0.9 }}>
            We may update these terms anytime. Continued use means acceptance of updates.
          </p>
        </>
      )}

      <div style={{ marginTop: 18 }}>
        <a href="/">← {lang === "ar" ? "الرئيسية" : "Home"}</a>
      </div>
    </div>
  );
}
