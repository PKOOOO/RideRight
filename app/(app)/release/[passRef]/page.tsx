import { notFound } from "next/navigation";
import { writeClient } from "@/sanity/lib/writeClient";
import Image from "next/image";
import { DownloadButton } from "./DownloadButton";

interface ReleaseData {
  passRef: string;
  issuedAt: string;
  issuedBy: string;
  authorizedBy: string;
  collectedBy: { name: string; phone: string; idNumber?: string };
  conditionNotes?: string;
  inclusions: Record<string, boolean>;
  vehicleName: string;
  registrationNumber: string;
}

const INCLUSION_LABELS: Record<string, string> = {
  jackHandle: "Jack Handle",
  jack: "Jack",
  jRaiser: "J/Raiser",
  radio: "Radio",
  cd: "CD",
  floorMatts: "Floor Mats",
  headRest: "Head Rest",
  cigaretteLighter: "C/Lighter",
  spareWheel: "Spare Wheel",
  wheelSpanner: "Wheel Spanner",
};

async function getRelease(passRef: string): Promise<ReleaseData | null> {
  return writeClient.fetch(
    `*[_type == "carRelease" && passRef == $passRef][0]{
      passRef, issuedAt, issuedBy, authorizedBy, collectedBy,
      conditionNotes, inclusions, vehicleName, registrationNumber
    }`,
    { passRef }
  );
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ passRef: string }>;
}) {
  const { passRef } = await params;
  const release = await getRelease(passRef);

  if (!release) notFound();

  const issuedDate = new Date(release.issuedAt).toLocaleString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const includedItems = Object.entries(release.inclusions || {})
    .filter(([, v]) => v)
    .map(([k]) => INCLUSION_LABELS[k] || k);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 print:bg-white print:py-0">
      <style>{`
      @media print {
        @page { size: A4; margin: 12mm; }
        html, body { height: auto !important; }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `}</style>
      <div className="max-w-2xl mx-auto bg-white shadow-lg print:shadow-none">
        {/* Header */}
        <div className="flex items-start justify-between p-8 pb-4">
          <div className="flex items-center gap-3">
            <Image
              src="/loggo.png"
              alt="RideRight Autos"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="text-sm text-gray-500">Ridgeways-Kiambu Road, Opposite Saj Ceramics</p>
              <p className="text-sm text-gray-500">Office Line: 0796 611 116</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs tracking-wide text-gray-400 font-semibold">GATE PASS</p>
            <p className="text-xl font-bold text-red-600">{issuedDate}</p>
          </div>
        </div>

        <div className="h-1 bg-red-600" />

        <div className="p-8 space-y-6">
          {/* Vehicle details */}
          <section>
            <h2 className="text-xs font-semibold tracking-wide text-gray-400 mb-2">
              VEHICLE DETAILS
            </h2>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <span className="text-gray-500">Vehicle</span>
              <span className="font-medium">{release.vehicleName}</span>
              <span className="text-gray-500">Reg No.</span>
              <span className="font-medium">{release.registrationNumber}</span>
            </div>
          </section>

          {/* Authorization */}
          <section>
            <h2 className="text-xs font-semibold tracking-wide text-gray-400 mb-2">
              AUTHORIZATION
            </h2>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <span className="text-gray-500">Issued By</span>
              <span className="font-medium">{release.issuedBy}</span>
              <span className="text-gray-500">Authorized By</span>
              <span className="font-medium text-red-600">{release.authorizedBy}</span>
            </div>
          </section>

          {/* Collection details */}
          <section className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <h2 className="text-xs font-semibold tracking-wide text-amber-700 mb-2">
              VEHICLE COLLECTION DETAILS
            </h2>
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <span className="text-gray-600">Collected By</span>
              <span className="font-medium">{release.collectedBy.name}</span>
              <span className="text-gray-600">Contact</span>
              <span className="font-medium">{release.collectedBy.phone}</span>
              {release.collectedBy.idNumber && (
                <>
                  <span className="text-gray-600">ID No.</span>
                  <span className="font-medium">{release.collectedBy.idNumber}</span>
                </>
              )}
            </div>
          </section>

          {/* Items included */}
          {includedItems.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold tracking-wide text-gray-400 mb-2">
                ITEMS INCLUDED AT EXIT
              </h2>
              <div className="flex flex-wrap gap-2 text-sm">
                {includedItems.map((item) => (
                  <span
                    key={item}
                    className="bg-gray-100 rounded px-2 py-1 text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Condition notes */}
          {release.conditionNotes && (
            <section className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <h2 className="text-xs font-semibold tracking-wide text-amber-700 mb-2">
                CONDITION NOTES AT EXIT
              </h2>
              <p className="text-sm italic text-gray-700">{release.conditionNotes}</p>
            </section>
          )}
        </div>

        <div className="h-1 bg-red-600" />

        {/* Footer / signature strip */}
        <div className="p-8 grid grid-cols-2 gap-8 text-sm text-gray-500 relative">
          <div>
            <p className="border-t border-gray-300 pt-2">Issued By</p>
            <p className="font-medium text-gray-800">{release.issuedBy}</p>
          </div>
          <div>
            <p className="border-t border-gray-300 pt-2">Received By (Signature &amp; ID)</p>
          </div>
          <Image
          src="/stamp.png"
          alt="RideRight Autos Official Stamp"
          width={160}
          height={160}
          className="absolute right-12 -top-16 opacity-90 z-10"
          />
        </div>

        <p className="text-center text-xs text-gray-400 pb-6">
          RideRight Autos Ltd — Authorized Vehicle Release · Generated {issuedDate}
        </p>
      </div>
      <DownloadButton />
    </div>
  );
}