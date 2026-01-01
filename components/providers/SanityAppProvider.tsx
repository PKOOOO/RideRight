"use client";

import { SanityApp } from "@sanity/sdk-react";
import { dataset, projectId } from "@/sanity/env";
import { useEffect, useState } from "react";

function SanityAppProvider({ children }: { children: React.ReactNode }) {
  const [origin, setOrigin] = useState<string | undefined>();

  useEffect(() => {
    // Explicitly detect and set the origin from window.location
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  return (
    <SanityApp
      config={[
        {
          projectId,
          dataset,
          // Explicitly set the origin to ensure correct redirect after authentication
          ...(origin && { origin }),
        },
      ]}
      // We handle the loading state in the Providers component by showing a loading indicator via the dynamic import
      fallback={<div />}
    >
      {children}
    </SanityApp>
  );
}

export default SanityAppProvider;
