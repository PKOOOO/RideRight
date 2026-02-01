import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://rideright.ke";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/studio/",
          "/orders/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
