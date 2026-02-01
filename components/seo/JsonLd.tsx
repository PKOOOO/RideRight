export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "RideRight Autos Ltd",
    description:
      "Your trusted partner for premium vehicles in Kenya. We offer end-to-end vehicle import services, locally used cars, and expert consultation.",
    url: "https://rideright.ke",
    logo: "https://rideright.ke/loggo.png",
    image: "https://rideright.ke/loggo.png",
    telephone: "+254796611116",
    address: {
      "@type": "PostalAddress",
      addressCountry: "KE",
      addressLocality: "Nairobi",
      addressRegion: "Nairobi",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.2921,
      longitude: 36.8219,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "16:00",
      },
    ],
    priceRange: "KES 500,000 - KES 20,000,000",
    sameAs: ["https://www.facebook.com/share/1Hib4Rn1ft/"],
    areaServed: {
      "@type": "Country",
      name: "Kenya",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Vehicles for Sale",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Import on Behalf",
          description: "Vehicle importation services from Japan, UK, Dubai, and more",
        },
        {
          "@type": "OfferCatalog",
          name: "Locally Used Cars",
          description: "Quality pre-owned vehicles available in Kenya",
        },
        {
          "@type": "OfferCatalog",
          name: "Foreign Used Cars",
          description: "Imported foreign used vehicles in stock and soon arriving",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ProductJsonLdProps {
  product: {
    name: string | null;
    description: string | null;
    price: number | null;
    slug: string | null;
    images: { asset: { url: string | null } | null }[] | null;
    year: number | null;
    fuelType: string | null;
    transmission: string | null;
    mileage: number | null;
    stock: number | null;
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const imageUrl = product.images?.[0]?.asset?.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: product.name,
    description: product.description,
    image: imageUrl,
    url: `https://rideright.ke/products/${product.slug}`,
    vehicleModelDate: product.year?.toString(),
    fuelType: product.fuelType,
    vehicleTransmission: product.transmission,
    mileageFromOdometer: product.mileage
      ? {
          "@type": "QuantitativeValue",
          value: product.mileage,
          unitCode: "KMT",
        }
      : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "KES",
      availability:
        (product.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "AutoDealer",
        name: "RideRight Autos Ltd",
        url: "https://rideright.ke",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RideRight",
    url: "https://rideright.ke",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://rideright.ke/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
