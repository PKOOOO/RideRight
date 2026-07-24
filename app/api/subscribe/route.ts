import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await writeClient.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email: normalizedEmail }
    );

    if (existing) {
      return NextResponse.json({ message: "Already subscribed" });
    }

    await writeClient.create({
      _type: "subscriber",
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}