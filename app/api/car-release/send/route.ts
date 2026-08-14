import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { sendOwnerEmail } from "@/lib/email/ownerNotify";

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  const release = await writeClient.fetch(
    `*[_id == $id][0]{
      passRef, issuedAt, issuedBy, authorizedBy, collectedBy, conditionNotes, inclusions,
      vehicleName, registrationNumber
    }`,
    { id }
  );

  if (!release) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const receiptUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/release/${release.passRef}`;

  try {
    await sendOwnerEmail({
      subject: `Car Released: ${release.vehicleName}`,
      text: `${release.vehicleName} (${release.registrationNumber}) was released to ${release.collectedBy.name} (${release.collectedBy.phone}) at ${new Date(release.issuedAt).toLocaleString("en-KE")}.\n\nAuthorized by: ${release.authorizedBy}\nReceipt: ${receiptUrl}`,
    });

    await writeClient.patch(id).set({ status: "sent" }).commit();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send owner notification:", err);
    return NextResponse.json(
      { error: "Failed to send notification", details: (err as Error).message },
      { status: 500 }
    );
  }
}