import { writeClient } from "../sanity/lib/writeClient";

async function main() {
  console.log("Fetching cars that aren't marked as notified yet...");

  const cars = await writeClient.fetch<{ _id: string; name: string }[]>(
    `*[_type == "product" && notifiedSubscribers != true]{ _id, name }`
  );

  if (!cars || cars.length === 0) {
    console.log("Nothing to backfill — all cars are already marked as notified.");
    return;
  }

  console.log(`Found ${cars.length} car(s) to mark as already-notified:`);
  cars.forEach((c) => console.log(`  - ${c.name} (${c._id})`));

  const tx = writeClient.transaction();
  for (const car of cars) {
    tx.patch(car._id, { set: { notifiedSubscribers: true } });
  }

  await tx.commit();

  console.log(`Done. Marked ${cars.length} car(s) as notifiedSubscribers: true.`);
  console.log("Future cron runs will only pick up cars published after this point.");
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});