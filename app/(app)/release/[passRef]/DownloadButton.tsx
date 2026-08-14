"use client";

export function DownloadButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden fixed bottom-6 right-6 bg-red-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-red-700 transition-colors text-sm font-medium"
    >
      Download PDF
    </button>
  );
}