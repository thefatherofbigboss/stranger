import type { Metadata } from "next";
import { getAllLiveEvents } from "@/lib/events";
import EventCard from "@/components/EventCard";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Stranger Meetup Events in Pune, Mumbai, Delhi, Bangalore | Weekend Social Networking & Friendship Meetups 2026",
    description: "Join 10,000+ professionals at stranger meetup events across India. Browse 100+ monthly social mixers, trekking groups, networking events & workshops in Pune, Mumbai, Delhi, Bangalore. Make genuine friends through safe, verified offline meetups every weekend.",
    keywords: "stranger meetup events India, social meetups Pune, networking events Mumbai, make friends Delhi, weekend events Bangalore, stranger networking India, offline social events, friendship meetups, young professionals events, singles social events India, meet new people events, IT professionals meetups, community events India",
    authors: [{ name: "Stranger Mingle Team" }],
    creator: "Stranger Mingle",
    publisher: "Stranger Mingle",
    category: "Social Events & Networking",
    classification: "Events and Community Networking",
    
    openGraph: {
        title: "Stranger Meetup Events in Pune, Mumbai, Delhi, Bangalore | Make Real Friends Offline",
        description: "Join India's largest stranger meetup community with 100+ monthly events including social mixers, treks, workshops & networking sessions. Safe, verified events for professionals looking to make genuine friends across major cities.",
        type: 'website',
        url: 'https://www.strangermingle.com/events',
        siteName: 'Stranger Mingle',
        locale: 'en_IN',
        images: [
            {
                url: 'https://www.strangermingle.com/og-events-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Stranger Mingle Events - Social Meetups and Networking Events Across India',
            }
        ],
    },
    
    twitter: {
        card: 'summary_large_image',
        title: "Stranger Meetup Events: Social Mixers, Treks & Networking | Pune, Mumbai, Delhi, Bangalore",
        description: "Browse 100+ monthly stranger meetup events across India. Join thousands making genuine friends through organised social events, workshops & weekend activities. Safe & verified community for professionals.",
        images: ['https://www.strangermingle.com/twitter-events-card.jpg'],
        site: '@StrangerMingle',
        creator: '@StrangerMingle',
    },
    
    alternates: {
        canonical: 'https://www.strangermingle.com/events',
    },
    
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    
    other: {
        'geo.region': 'IN',
        'geo.placename': 'India',
        'geo.position': '20.5937;78.9629',
    },
};

export default async function EventsPage() {
    const events = await getAllLiveEvents();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
            {/* Page Header */}
            <section className="relative w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 pt-32 pb-16 px-4 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto text-center">
                    <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                        <span className="text-white/90 text-sm font-semibold">🎉 Weekly Events</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        Upcoming Events
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                        Find your crowd. Join an offline experience this weekend.
                    </p>
                </div>
            </section>

            {/* Events Grid */}
            <main className="w-full max-w-7xl mx-auto px-4 py-16 -mt-8">
                {events.length > 0 ? (
                    <>
                        <div className="grid md:grid-cols-3 gap-8 mb-8">
                            {events.map((event) => (
                                <div key={event.id} className="h-full">
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </div>
                        
                        {/* Stats Bar */}
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{events.length}</div>
                                <div className="text-gray-600 font-medium">Live Events</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {events.reduce((sum, e) => sum + (e.available_seats - e.booked_spots), 0)}
                                </div>
                                <div className="text-gray-600 font-medium">Available Spots</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {new Set(events.map(e => e.city)).size}
                                </div>
                                <div className="text-gray-600 font-medium">Cities</div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-400 mb-2">No events scheduled right now.</h3>
                        <p className="text-gray-500">Check back later for new updates!</p>
                    </div>
                )}
            </main>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
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
                                }
                            ]
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "CollectionPage",
                            "name": "Stranger Meetup Events in India",
                            "description": "Browse upcoming stranger meetup and social networking events across Pune, Mumbai, Delhi, and Bangalore",
                            "url": "https://www.strangermingle.com/events",
                            "publisher": {
                                "@type": "Organization",
                                "name": "Stranger Mingle",
                                "url": "https://www.strangermingle.com",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://www.strangermingle.com/logo.png"
                                }
                            }
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "numberOfItems": events.length,
                            "itemListElement": events.map((event, index) => ({
                                "@type": "ListItem",
                                "position": index + 1,
                                "item": {
                                    "@type": "Event",
                                    "name": event.event_name,
                                    "description": event.description || `Join us for ${event.event_name} on ${event.start_date} at ${event.short_address}.`,
                                    "startDate": `${event.start_date}T${event.start_time}`,
                                    "endDate": `${event.end_date}T${event.end_time}`,
                                    "eventStatus": "https://schema.org/EventScheduled",
                                    "eventAttendanceMode": event.event_type === 'online' 
                                        ? "https://schema.org/OnlineEventAttendanceMode"
                                        : "https://schema.org/OfflineEventAttendanceMode",
                                    "image": event.image_url || undefined,
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
                                    "organizer": {
                                        "@type": "Organization",
                                        "name": event.organizer_name || "Stranger Mingle",
                                        "email": event.organizer_email || undefined,
                                        "telephone": event.organizer_phone || undefined,
                                        "url": "https://www.strangermingle.com"
                                    },
                                    "offers": {
                                        "@type": "Offer",
                                        "url": `https://www.strangermingle.com/events/${event.slug || event.id}`,
                                        "price": event.regular_price === 0 ? "0" : (event.discounted_price || event.regular_price).toString(),
                                        "priceCurrency": "INR",
                                        "availability": (event.available_seats - event.booked_spots) > 0 
                                            ? "https://schema.org/InStock" 
                                            : "https://schema.org/SoldOut",
                                        "validFrom": event.created_at
                                    },
                                    "url": `https://www.strangermingle.com/events/${event.slug || event.id}`
                                }
                            }))
                        }
                    ])
                }}
            />
        </div>
    );
}