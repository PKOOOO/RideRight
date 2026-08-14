import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "RideRight Autos <updates@updates.rideright.ke>";

export async function sendOwnerEmail({
  subject,
  text,
}: {
  subject: string;
  text: string;
}) {
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: process.env.OWNER_EMAIL!,
    subject,
    text,
  });

  if (error) {
    console.error("Resend error sending owner notification:", error);
    throw new Error(error.message);
  }
}