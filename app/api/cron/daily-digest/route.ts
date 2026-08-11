import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { writeClient } from "@/sanity/lib/writeClient";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "RideRight Autos <updates@updates.rideright.ke>";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const newCars = await writeClient.fetch(
    `*[_type == "product" && notifiedSubscribers != true] {
      _id,
      name,
      "slug": slug.current,
      price
    } | order(_createdAt desc)`
  );

  if (!newCars || newCars.length === 0) {
    return NextResponse.json({ message: "No new cars, skipping digest" });
  }

  const subscribers = await writeClient.fetch(
    `*[_type == "subscriber"]{ email }`
  );

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ message: "No subscribers" });
  }

  const carListHtml = newCars
    .map(
      (car: { name: string; slug: string; price: number }) => `
      <tr>
        <td style="padding:10px 0; border-top:1px solid #eee;">${car.name}</td>
        <td style="padding:10px 0; border-top:1px solid #eee; text-align:right;">KES ${car.price != null ? `${car.price}M` : "N/A"}</td>
      </tr>`
    )
    .join("");

  const emailHtml = `
    <div style="font-family:sans-serif; max-width:480px; margin:0 auto;">
      <h2>${newCars.length} new car${newCars.length > 1 ? "s" : ""} just arrived</h2>
      <p>Here's what's new at RideRight today.</p>
      <table style="width:100%; border-collapse:collapse;">${carListHtml}</table>
      <a href="https://www.rideright.ke" style="display:inline-block; margin-top:20px; background:#ef4444; color:white; padding:10px 20px; text-decoration:none; border-radius:6px;">
        View all new cars
      </a>
    </div>
  `;

  const emails = subscribers.map((s: { email: string }) => s.email);

  const BATCH_SIZE = 50;
  let sentCount = 0;

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: FROM_ADDRESS,
      bcc: batch,
      subject: `${newCars.length} new car${newCars.length > 1 ? "s" : ""} just arrived at RideRight`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error for batch starting at index", i, error);
      return NextResponse.json(
        { error: "Failed to send digest", details: error.message },
        { status: 500 }
      );
    }

    sentCount += batch.length;
  }

  const tx = writeClient.transaction();
  for (const car of newCars as { _id: string }[]) {
    tx.patch(car._id, { set: { notifiedSubscribers: true } });
  }
  await tx.commit();

  return NextResponse.json({
    message: `Digest sent to ${sentCount} subscribers for ${newCars.length} car(s)`,
  });
}