"use client";

import { useMemo, useState } from "react";

type Lang = "ar" | "en";
type ShadowKey = "fear" | "greed" | "avarice" | "money";

type Q = {
  q_ar: string;
  q_en: string;
  options: { ar: string; en: string; key: ShadowKey }[];
};

const QUESTIONS: Q[] = [
  {
    q_ar: "1) عندما تخسر صفقة…",
    q_en: "1) When you lose a trade…",
    options: [
      { ar: "أغلق بسرعة حتى لو قبل الخطة", en: "I exit early even if it breaks the plan", key: "fear" },
      { ar: "أدخل مباشرة لتعويض الخسارة", en: "I jump in to recover immediately", key: "greed" },
      { ar: "أرفع المخاطرة لأرجع بأي طريقة", en: "I increase risk to get it back no matter what", key: "avarice" },
      { ar: "أتوتر وأفكر في المال فقط", en: "My mind locks on the balance & money only", key: "money" },
    ],
  },
  {
    q_ar: "2) عندما تربح صفقة قوية…",
    q_en: "2) When you win a strong trade…",
    options: [
      { ar: "أقفل بدري خوفًا من رجوع السعر", en: "I take profit too early fearing reversal", key: "fear" },
      { ar: "أقول ممكن أكثر وأدخل ثاني", en: "I want more and re-enter quickly", key: "greed" },
      { ar: "لازم أضاعف الربح اليوم", en: "I must double my profit today", key: "avarice" },
      { ar: "أبدأ أحسب وش أقدر أشتري", en: "I start counting what money will get me", key: "money" },
    ],
  },
  {
    q_ar: "3) إذا السوق كان هادئ وما فيه فرص…",
    q_en: "3) If the market is quiet and there are no opportunities…",
    options: [
      { ar: "أرتاح وأنتظر", en: "I wait calmly", key: "fear" },
      { ar: "أدور فرصة بأي شكل", en: "I force trades to find opportunities", key: "greed" },
      { ar: "أدخل صفقات كثيرة لأن لازم أربح", en: "I overtrade because I must profit", key: "avarice" },
      { ar: "أحس الوقت ضائع لأن ما في فلوس", en: "Time feels wasted because no money comes in", key: "money" },
    ],
  },
  {
    q_ar: "4) أكبر شيء يخليك تكسر الخطة؟",
    q_en: "4) What breaks your trading plan the most?",
    options: [
      { ar: "الخوف من الخسارة", en: "Fear of losing", key: "fear" },
      { ar: "فرصة ربح سريعة", en: "A quick profit opportunity", key: "greed" },
      { ar: "إحساس لازم أكون غني بسرعة", en: "The urge to get rich fast", key: "avarice" },
      { ar: "ضغط مالي حقيقي في حياتي", en: "Real-life money pressure", key: "money" },
    ],
  },
  {
    q_ar: "5) لما الصفقة تمشي ضدك…",
    q_en: "5) When the trade goes against you…",
    options: [
      { ar: "أقفل فورًا حتى لو الستوب بعيد", en: "I exit instantly even before stop-loss", key: "fear" },
      { ar: "أنتظر لأنها بترجع", en: "I hold because it will come back", key: "greed" },
      { ar: "أضاعف العقد", en: "I double down", key: "avarice" },
      { ar: "أتوتر لأن رصيدي ينقص", en: "Balance drop crushes my focus", key: "money" },
    ],
  },
  {
    q_ar: "6) لما تربح أسبوع كامل…",
    q_en: "6) After a full winning week…",
    options: [
      { ar: "أخاف أخسر فأخفف جدًا", en: "I become overly cautious", key: "fear" },
      { ar: "أدخل أكثر لأن الأسبوع ماشي", en: "I increase trades because momentum is good", key: "greed" },
      { ar: "أرفع كل شيء لأصنع رقم كبير", en: "I aim for a huge number aggressively", key: "avarice" },
      { ar: "أحسب كم لازم أربح شهريًا", en: "I obsess over monthly money goals", key: "money" },
    ],
  },
  {
    q_ar: "7) شعورك قبل دخول صفقة؟",
    q_en: "7) Your feeling before entering a trade?",
    options: [
      { ar: "توتر وتردد", en: "Anxiety & hesitation", key: "fear" },
      { ar: "حماس ورغبة في الربح", en: "Excitement for profit", key: "greed" },
      { ar: "اندفاع وثقة مفرطة", en: "Rush & overconfidence", key: "avarice" },
      { ar: "تفكير كم أربح وكم أخسر فقط", en: "Money-only thinking", key: "money" },
    ],
  },
  {
    q_ar: "8) لما تشوف غيرك يربح…",
    q_en: "8) When you see others winning…",
    options: [
      { ar: "أخاف أدخل غلط", en: "I fear messing up", key: "fear" },
      { ar: "أدخل بسرعة حتى ألحق", en: "I jump in fast to catch up", key: "greed" },
      { ar: "أدخل بأكبر حجم", en: "I go big immediately", key: "avarice" },
      { ar: "أحس بالضغط لأن فلوسي أقل منهم", en: "I feel pressure because I have less money", key: "money" },
    ],
  },
  {
    q_ar: "9) بعد خسارة قوية…",
    q_en: "9) After a big loss…",
    options: [
      { ar: "أبتعد عن السوق أيام", en: "I avoid trading for days", key: "fear" },
      { ar: "أرجع بسرعة لأعوّض", en: "I rush back to recover", key: "greed" },
      { ar: "أصير عنيف في التداول", en: "I become aggressive and reckless", key: "avarice" },
      { ar: "أحس حياتي توقفت بسبب المال", en: "I feel my life stopped because of money", key: "money" },
    ],
  },
  {
    q_ar: "10) إذا رصيدك زاد…",
    q_en: "10) When your balance grows…",
    options: [
      { ar: "أتوتر لأن الخسارة تصير أكبر", en: "I fear losing more now", key: "fear" },
      { ar: "أقول الفرص أكبر", en: "I see bigger opportunities", key: "greed" },
      { ar: "أريد قفزة ضخمة", en: "I want a massive jump", key: "avarice" },
      { ar: "أفكر في المال كأمان نفسي", en: "Money becomes my emotional safety", key: "money" },
    ],
  },
  {
    q_ar: "11) علاقتك بالانتظار؟",
    q_en: "11) Your relationship with waiting?",
    options: [
      { ar: "الانتظار يحميني", en: "Waiting protects me", key: "fear" },
      { ar: "الانتظار يضيع الفرص", en: "Waiting kills opportunities", key: "greed" },
      { ar: "الانتظار ضعف", en: "Waiting is weakness", key: "avarice" },
      { ar: "الانتظار يضيع المال", en: "Waiting wastes money", key: "money" },
    ],
  },
  {
    q_ar: "12) كيف تعرف أنك ناجح في التداول؟",
    q_en: "12) How do you know you're successful in trading?",
    options: [
      { ar: "لما أحس بالهدوء والتحكم", en: "When I feel calm and in control", key: "fear" },
      { ar: "لما أربح باستمرار", en: "When I profit consistently", key: "greed" },
      { ar: "لما أربح كثير وبسرعة", en: "When I profit big and fast", key: "avarice" },
      { ar: "لما يصبح المال حل لكل شيء", en: "When money solves everything", key: "money" },
    ],
  },
];

function label(lang: Lang, key: ShadowKey) {
  const ar = { fear: "ظل الخوف", greed: "ظل الطمع", avarice: "ظل الجشع", money: "ظل مال المتداول" };
  const en = { fear: "Fear Shadow", greed: "Greed Shadow", avarice: "Avarice Shadow", money: "Money Shadow" };
  return lang === "ar" ? ar[key] : en[key];
}

function advice(lang: Lang, key: ShadowKey) {
  const ar = {
    fear: "الخوف يجعلك ترى الخسارة قبل حدوثها. الحل: خطة مكتوبة + تقليل المخاطرة + احترام الستوب.",
    greed: "الطمع يجعلك تطلب المزيد بعد الربح. الحل: هدف أسبوعي واضح + توقف بعد تحقيقه.",
    avarice: "الجشع يدفعك للتضخيم والمخاطرة. الحل: تقسيم رأس المال + عدم مضاعفة العقود.",
    money: "ضغط المال يسرق تركيزك. الحل: افصل قيمتك عن رصيدك + لا تتداول تحت ضغط مالي.",
  };
  const en = {
    fear: "Fear makes you see loss before it happens. Fix: written plan + smaller risk + respect stop-loss.",
    greed: "Greed asks for more after profit. Fix: clear weekly goal + stop when reached.",
    avarice: "Avarice pushes reckless escalation. Fix: divide capital + avoid doubling down.",
    money: "Money pressure steals focus. Fix: separate self-worth from balance + avoid trading under pressure.",
  };
  return lang === "ar" ? ar[key] : en[key];
}

export default function ShadowTestPage() {
  const [lang, setLang] = useState<Lang>("ar");
  const [answers, setAnswers] = useState<Record<number, ShadowKey | null>>({});
  const [done, setDone] = useState(false);

  const totals = useMemo(() => {
    const t: Record<ShadowKey, number> = { fear: 0, greed: 0, avarice: 0, money: 0 };
    Object.values(answers).forEach((k) => {
      if (k) t[k] += 1;
    });
    return t;
  }, [answers]);

  const topShadow = useMemo(() => {
    const entries = Object.entries(totals) as [ShadowKey, number][];
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0]?.[0] ?? "fear";
  }, [totals]);

  const totalAnswered = Object.values(answers).filter(Boolean).length;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>🧠 {lang === "ar" ? "اختبار الظل الغالب لديك" : "Your Dominant Shadow Test"}</h1>

        <button onClick={() => setLang((p) => (p === "ar" ? "en" : "ar"))} style={{ cursor: "pointer" }}>
          {lang === "ar" ? "AR ✅ / EN" : "AR / EN ✅"}
        </button>
      </div>

      <p style={{ opacity: 0.8, marginTop: 10 }}>
        {lang === "ar"
          ? "أجب بصراحة… الهدف فهم نفسك داخل السوق."
          : "Answer honestly… this is about understanding yourself in the market."}
      </p>

      {!done && (
        <>
          <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
            {QUESTIONS.map((q, i) => (
              <div key={i} style={{ border: "1px solid #ddd", borderRadius: 14, padding: 14 }}>
                <b style={{ display: "block", marginBottom: 10 }}>{lang === "ar" ? q.q_ar : q.q_en}</b>

                <div style={{ display: "grid", gap: 8 }}>
                  {q.options.map((op, idx) => {
                    const checked = answers[i] === op.key;
                    return (
                      <button
                        key={idx}
                        onClick={() => setAnswers((p) => ({ ...p, [i]: op.key }))}
                        style={{
                          textAlign: "left",
                          padding: 10,
                          borderRadius: 12,
                          border: "1px solid #eee",
                          background: checked ? "#f5f5f5" : "white",
                          cursor: "pointer",
                        }}
                      >
                        {lang === "ar" ? op.ar : op.en}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setDone(true)}
            disabled={totalAnswered < QUESTIONS.length}
            style={{ marginTop: 16, padding: 12, fontWeight: 900, cursor: "pointer" }}
          >
            {lang === "ar" ? "عرض النتيجة" : "Show Result"}
          </button>

          <p style={{ marginTop: 10, opacity: 0.7 }}>
            {lang === "ar" ? `أجبت: ${totalAnswered}/${QUESTIONS.length}` : `Answered: ${totalAnswered}/${QUESTIONS.length}`}
          </p>
        </>
      )}

      {done && (
        <div style={{ marginTop: 18, border: "1px solid #ddd", borderRadius: 14, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>
            ✅ {lang === "ar" ? "نتيجتك" : "Your Result"}: {label(lang, topShadow)}
          </h2>

          <p style={{ opacity: 0.9 }}>{advice(lang, topShadow)}</p>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <div>Fear: {totals.fear}</div>
            <div>Greed: {totals.greed}</div>
            <div>Avarice: {totals.avarice}</div>
            <div>Money: {totals.money}</div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <a
              href="/reader?c=chapter-2-four-shadows"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #111",
                fontWeight: 900,
              }}
            >
              📖 {lang === "ar" ? "اقرأ فصل الظلال الآن" : "Read Shadows Chapter"}
            </a>

            <a href="/" style={{ padding: "10px 14px" }}>
              {lang === "ar" ? "الرئيسية" : "Home"}
            </a>

            <button onClick={() => { setDone(false); setAnswers({}); }} style={{ padding: "10px 14px", borderRadius: 12 }}>
              {lang === "ar" ? "إعادة الاختبار" : "Retake"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
