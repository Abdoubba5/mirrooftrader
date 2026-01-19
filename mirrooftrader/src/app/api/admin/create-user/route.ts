import { NextResponse } from "next/server";
import ... from "../../../../lib/firebaseAdmin"

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const publicId = String(body.publicId || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!publicId || password.length < 6) {
      return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
    }

    const email = `${publicId}@mirrooftrader.com`;

    const user = await adminAuth.createUser({
      email,
      password,
      displayName: publicId,
    });

    await adminDb.collection("users").doc(user.uid).set({
      uid: user.uid,
      publicId,
      active: false,
      expiresAt: null,
      role: "user",
      createdAt: Date.now(),
      lastRead: null,
    });

    return NextResponse.json({ ok: true, uid: user.uid });
  } catch {
    return NextResponse.json({ ok: false, error: "FAILED" }, { status: 500 });
  }
}

