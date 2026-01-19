import { NextResponse } from "next/server";
import admin from "../../../../lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const publicId = String(body?.publicId || "").trim();
    const password = String(body?.password || "").trim();

    if (!publicId || !password) {
      return NextResponse.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    const email = `${publicId}@mirrooftrader.local`;

    const user = await admin.auth().createUser({
      email,
      password,
      displayName: publicId,
    });

    await admin.firestore().collection("users").doc(user.uid).set({
      uid: user.uid,
      publicId,
      active: true,
      role: "user",
      createdAt: Date.now(),
      expiresAt: null,
      lastRead: null,
    });

    return NextResponse.json({ ok: true, uid: user.uid });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
