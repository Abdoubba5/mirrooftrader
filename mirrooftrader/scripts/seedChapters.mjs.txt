import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const chapters = [
  {
    order: 1,
    slug: "dedication",
    title_ar: "الإهداء",
    title_en: "Dedication",
    content_ar: "سيتم إضافة النسخة العربية قريبًا…",
    content_en: `To every trader sitting alone in the middle of the night, before a screen glowing with a cold light, reflecting a greater inner struggle; where logic battles desire, discipline clashes with chaos, and hope with despair..

To those who realized too late that the market is not an external adversary, but a harsh mirror that reveals them to themselves, exposing their weaknesses, their arrogance, and their old wounds.

To those who lost money, or more than money: they lost sleep, they lost peace of mind, they lost the image of themselves they thought they knew. Then they returned to rebuild, not on screens, but in the depths of their souls..

To everyone who has walked this path filled with disappointment and hope: you are not just traders, you are warriors in a silent battle against yourselves..

And to the reader opening this book now: you may find yourself between the lines, and you may discover that you are not alone on this journey. What you feel, others may feel; what you have suffered, others have overcome; and what you are searching for, you may find here in a moment of honesty with yourself..

This book is not dedicated to the victors, but to the wounded who continued on despite the bleeding. For loss is not the end of the journey, but the beginning of a deeper one, an inner journey toward a new awareness.`,
  },
  {
    order: 2,
    slug: "introduction",
    title_ar: "المقدمة: الرحلة التي لم يخبرك بها أحد",
    title_en: "Introduction: The trip no one told you about",
    content_ar: "سيتم إضافة النسخة العربية قريبًا…",
    content_en: `The screen was red... the losses were piling up... and a feeling of suffocation filled your chest.
At that moment, an inner voice whispers to you: "Get out before you lose everything!" or "Keep going... you must return."!

But the truth is, this wasn't a battle with the market.
Rather, it was a battle with yourself..

The market doesn't appeal to your logical mind; it plays on your emotions. Every candle, every movement, every piece of news… is merely a reflection of your inner struggle. This book is your guide to deciphering those hidden messages and building a mindset that remains unshaken in the face of adversity..

You will find yourself facing four main ghosts:

Greed — The one that burns inside.
Avarice — The one who swallows the mind.
Fear — The one who haunts you in the shadows.
Boredom — The one who whispers with deadly silence.`,
  },
  {
    order: 3,
    slug: "chapter-1-market-mirror",
    title_ar: "الفصل الأول: السوق مرآة الروح",
    title_en: "Chapter One: The Market is a Mirror of the Soul",
    content_ar: "سيتم إضافة النسخة العربية قريبًا…",
    content_en: `The market is not numbers moving on a screen, nor green and red candles pulsating with ups and downs.

The market is a mirror… a clear mirror that does not lie, but it is harsh, revealing everything we hide inside.
When you sit in front of the screen and open a deal, you are not just facing the "market"... you are facing yourself: your fear, your greed, your desire to control, and even your old complexes.
Money is just a medium, but the real test is within you.`,
  },
];

async function run() {
  for (const ch of chapters) {
    await setDoc(doc(db, "chapters", ch.slug), ch, { merge: true });
    console.log("Seeded:", ch.slug);
  }
  console.log("✅ Chapters seeded");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
