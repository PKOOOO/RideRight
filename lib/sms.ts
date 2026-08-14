export async function sendSms({ to, message }: { to: string; message: string }) {
  const formatted = to.startsWith("+")
    ? to
    : `+254${to.replace(/^0/, "").replace(/\s+/g, "")}`;

  const params = new URLSearchParams({
    username: process.env.AFRICASTALKING_USERNAME!,
    to: formatted,
    message,
  });

  if (process.env.AFRICASTALKING_SENDER_ID) {
    params.append("from", process.env.AFRICASTALKING_SENDER_ID);
  }

  const res = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: {
      apikey: process.env.AFRICASTALKING_API_KEY!,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: params.toString(),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Africa's Talking SMS error:", data);
    throw new Error(`SMS send failed: ${res.status}`);
  }

  return data;
}