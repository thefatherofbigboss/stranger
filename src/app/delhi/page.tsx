import type { Metadata } from "next";
import CityEventsPage from "@/components/CityEventsPage";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Delhi Events - Stranger Mingle | Weekend Meetups in Delhi",
    description: "Browse upcoming offline events in Delhi. Treks, workshops, social mixers, and more.",
};

export default function DelhiEventsPage() {
    return <CityEventsPage cityName="Delhi" />;
}
