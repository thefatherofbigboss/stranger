import type { Metadata } from "next";
import { getAllLiveEvents } from "@/lib/events";
import EventCard from "@/components/EventCard";

export const metadata: Metadata = {
    title: "All Events - Stranger Mingle | Weekend Meetups",
    description: "Browse all upcoming offline events. Treks, workshops, social mixers, and more.",
};

export default async function EventsPage() {
    const events = await getAllLiveEvents();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            {/* Page Header */}
            <section className="w-full bg-white border-b border-gray-200 pt-32 pb-12 px-4 shadow-sm">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Find your crowd. Join an offline experience this weekend.
                    </p>
                </div>
            </section>

            {/* Events Grid */}
            <main className="w-full max-w-7xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event.id} className="h-full">
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-gray-400">No events scheduled right now.</h3>
                        <p className="text-gray-500 mt-2">Check back later for new updates!</p>
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
                                    "item": "https://strangermingle.com"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 2,
                                    "name": "Events",
                                    "item": "https://strangermingle.com/events"
                                }
                            ]
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "itemListElement": events.map((event, index) => ({
                                "@type": "ListItem",
                                "position": index + 1,
                                "item": {
                                    "@type": "Event",
                                    "name": event.event_name,
                                    "startDate": event.start_date,
                                    "endDate": event.end_date,
                                    "location": {
                                        "@type": "Place",
                                        "name": event.short_address,
                                        "address": {
                                            "@type": "PostalAddress",
                                            "addressLocality": event.city,
                                            "addressCountry": "IN"
                                        }
                                    },
                                    "offers": {
                                        "@type": "Offer",
                                        "price": event.regular_price === 0 ? "0" : (event.discounted_price || event.regular_price).toString(),
                                        "priceCurrency": "INR"
                                    }
                                }
                            }))
                        }
                    ])
                }}
            />
        </div>
    );
}
