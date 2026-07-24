import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const existing = await writeClient.fetch(
      `*[_type == "subscriber" && email == $email][0]{ _id }`,
      { email: email.trim().toLowerCase() }
    );

    if (existing?._id) {
      await writeClient.delete(existing._id);
    }

    return NextResponse.json({ message: "Unsubscribed" });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}