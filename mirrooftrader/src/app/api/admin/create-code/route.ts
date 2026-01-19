import { NextResponse } from "next/server";
import admin from "../../../../lib/firebaseAdmin";

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "MTR-";
  for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
  out += "-";
  for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const days = Number(body?.days || 30);

    const code = randomCode();
    await admin.firestore().collection("codes").doc(code).set({
      code,
      days,
      used: false,
      createdAt: Date.now(),
    });

    return NextResponse.json({ ok: true, code });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
