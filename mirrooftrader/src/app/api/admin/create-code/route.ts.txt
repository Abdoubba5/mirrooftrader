import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = (n: number) =>
    Array.from({ length: n })
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join("");
  return `MTR-${part(4)}-${part(4)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const durationDays = Number(body.durationDays || 30);

    const code = randomCode();

    await adminDb.collection("codes").doc(code).set({
      code,
      durationDays,
      used: false,
      usedBy: null,
      createdAt: Date.now(),
    });

    return NextResponse.json({ ok: true, code });
  } catch {
    return NextResponse.json({ ok: false, error: "FAILED" }, { status: 500 });
  }
}
