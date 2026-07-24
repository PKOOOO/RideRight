import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { writeClient } from "@/sanity/lib/writeClient";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function GET(req: NextRequest) {
  // const authHeader = req.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const newCars = await writeClient.fetch(
    `*[_type == "product" && _createdAt >= $since] {
      name,
      "slug": slug.current,
      price
    } | order(_createdAt desc)`,
    { since: oneDayAgo }
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
        <td style="padding:10px 0; border-top:1px solid #eee; text-align:right;">KES ${car.price?.toLocaleString() ?? "N/A"}</td>
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

  await transporter.sendMail({
    from: `"RideRight Autos" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    bcc: emails,
    subject: `${newCars.length} new car${newCars.length > 1 ? "s" : ""} just arrived at RideRight`,
    html: emailHtml,
  });

  return NextResponse.json({ message: `Digest sent to ${emails.length} subscribers` });
}