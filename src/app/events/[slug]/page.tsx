import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicEventBySlug } from '@/lib/events';
import EventDetailsPage from '@/components/EventDetailsPage';
import SponsoredAds from '@/components/SponsoredAds';

export const dynamic = 'force-static';
export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

/* =========================
   Metadata (SEO)
========================= */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);

  if (!event) {
    return { title: 'Event Not Found | Stranger Mingle' };
  }

  const eventUrlSlug = event.slug || event.id;
  const canonicalUrl = `https://www.strangermingle.com/events/${eventUrlSlug}`;

  const description =
    event.description ||
    `Join us for ${event.event_name} on ${event.start_date} at ${event.short_address}. ${
      event.available_seats - event.booked_spots
    } spots available.`;

  return {
    title: `${event.event_name} | Stranger Mingle Events`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: event.event_name,
      description,
      url: canonicalUrl,
      type: 'website',
      images: event.image_url ? [event.image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.event_name,
      description,
      images: event.image_url ? [event.image_url] : [],
    },
  };
}

/* =========================
   Page
========================= */
export default async function EventDetails({ params }: Props) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);

  if (!event) notFound();

  const price =
    event.discounted_price && event.discounted_price < event.regular_price
      ? event.discounted_price
      : event.regular_price;

  const eventUrlSlug = event.slug || event.id;
  const availableSeats = event.available_seats - event.booked_spots;

  /* =========================
     Structured Data
  ========================= */
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.event_name,
    "description":
      event.description ||
      `Join us for ${event.event_name} on ${event.start_date} at ${event.short_address}.`,
    "startDate": `${event.start_date}T${event.start_time}`,
    "endDate": `${event.end_date}T${event.end_time}`,
    "eventAttendanceMode":
      event.event_type === 'online'
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus":
      event.status === 'cancelled'
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    "url": `https://www.strangermingle.com/events/${eventUrlSlug}`,
    "image": event.image_url ? [event.image_url] : undefined,
    "location":
      event.event_type === 'online'
        ? {
            "@type": "VirtualLocation",
            "url": event.meeting_link,
          }
        : {
            "@type": "Place",
            "name": event.short_address,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": event.full_address,
              "addressLocality": event.city,
              "addressRegion": "MH",
              "addressCountry": "IN",
            },
          },
    "organizer": {
      "@type": "Organization",
      "name": event.organizer_name || "Stranger Mingle",
      "url": "https://www.strangermingle.com",
      ...(event.organizer_email && { email: event.organizer_email }),
      ...(event.organizer_phone && { telephone: event.organizer_phone }),
    },
    "performer": {
      "@type": "Organization",
      "name": "Stranger Mingle",
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.strangermingle.com/events/${eventUrlSlug}`,
      "price": price === 0 ? "0" : price.toString(),
      "priceCurrency": "INR",
      "availability":
        availableSeats > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      "validFrom": event.ticket_sale_start 
        ? new Date(event.ticket_sale_start).toISOString()
        : `${event.start_date}T${event.start_time}`,
      "inventoryLevel": {
        "@type": "QuantitativeValue",
        "value": availableSeats,
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.strangermingle.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Events",
        "item": "https://www.strangermingle.com/events",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": event.event_name,
        "item": `https://www.strangermingle.com/events/${eventUrlSlug}`,
      },
    ],
  };

  return (
    <>
      <EventDetailsPage event={event} />

      {/* Event Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Sponsored Ads */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Sponsored Content
          </h2>
          <SponsoredAds />
        </div>
      </div>
    </>
  );
}
