import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicEventBySlug } from '@/lib/events';
import EventDetailsPage from '@/components/EventDetailsPage';
import SponsoredAds from '@/components/SponsoredAds';

type Props = {
    params: Promise<{ slug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const event = await getPublicEventBySlug(slug);

    if (!event) {
        return {
            title: 'Event Not Found | Stranger Mingle',
        };
    }

    // Use slug in URL if available, fallback to id for backward compatibility
    const eventUrlSlug = event.slug || event.id;
    const canonicalUrl = `https://www.strangermingle.com/events/${eventUrlSlug}`;

    return {
        title: `${event.event_name} | Stranger Mingle Events`,
        description: event.description || `Join us for ${event.event_name} on ${event.start_date} at ${event.short_address}. ${event.available_seats - event.booked_spots} spots available.`,
        openGraph: {
            title: event.event_name,
            description: event.description || `Join us for ${event.event_name} on ${event.start_date} at ${event.short_address}.`,
            images: event.image_url ? [event.image_url] : [],
            type: 'website',
            url: canonicalUrl,
        },
        twitter: {
            card: 'summary_large_image',
            title: event.event_name,
            description: event.description || `Join us for ${event.event_name} on ${event.start_date} at ${event.short_address}.`,
            images: event.image_url ? [event.image_url] : [],
        },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

export default async function EventDetails({ params }: Props) {
    const { slug } = await params;
    const event = await getPublicEventBySlug(slug);

    if (!event) {
        notFound();
    }

    // Calculate the final price (discounted if available, otherwise regular)
    const price = event.discounted_price && event.discounted_price < event.regular_price
        ? event.discounted_price
        : event.regular_price;

    // Use slug in URL if available, fallback to id for backward compatibility
    const eventUrlSlug = event.slug || event.id;

    return (
        <>
            <EventDetailsPage event={event} />
            
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Event",
                        "name": event.event_name,
                        "description": event.description || `Join us for ${event.event_name} on ${event.start_date} at ${event.short_address}.`,
                        "startDate": `${event.start_date}T${event.start_time}`,
                        "endDate": `${event.end_date}T${event.end_time}`,
                        "eventStatus": event.status === 'live' 
                            ? "https://schema.org/EventScheduled" 
                            : event.status === 'closed' 
                            ? "https://schema.org/EventPostponed"
                            : "https://schema.org/EventCancelled",
                        "url": `https://www.strangermingle.com/events/${eventUrlSlug}`,
                        "eventAttendanceMode": event.event_type === 'online' 
                            ? "https://schema.org/OnlineEventAttendanceMode"
                            : "https://schema.org/OfflineEventAttendanceMode",
                        "location": {
                            "@type": event.event_type === 'online' ? "VirtualLocation" : "Place",
                            "name": event.short_address,
                            "address": event.event_type === 'online' ? undefined : {
                                "@type": "PostalAddress",
                                "streetAddress": event.full_address,
                                "addressLocality": event.city,
                                "addressCountry": "IN"
                            },
                            "url": event.event_type === 'online' ? event.google_map_link : undefined
                        },
                        "image": event.image_url || undefined,
                        "organizer": event.organizer_name ? {
                            "@type": "Organization",
                            "name": event.organizer_name,
                            "email": event.organizer_email || undefined,
                            "telephone": event.organizer_phone || undefined,
                            "url": "https://www.strangermingle.com"
                        } : {
                            "@type": "Organization",
                            "name": "Stranger Mingle",
                            "url": "https://www.strangermingle.com"
                        },
                        "offers": {
                            "@type": "Offer",
                            "url": `https://www.strangermingle.com/events/${eventUrlSlug}`,
                            "price": event.regular_price === 0 ? "0" : price.toString(),
                            "priceCurrency": "INR",
                            "availability": event.available_seats - event.booked_spots > 0 
                                ? "https://schema.org/InStock" 
                                : "https://schema.org/SoldOut",
                            "validFrom": event.created_at
                        }
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://www.strangermingle.com"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Events",
                                "item": "https://www.strangermingle.com/events"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": event.event_name,
                                "item": `https://www.strangermingle.com/events/${eventUrlSlug}`
                            }
                        ]
                    }),
                }}
            />
            
            {/* Sponsored Ads Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Sponsored Content</h2>
                    <SponsoredAds />
                </div>
            </div>
        </>
    );
}
