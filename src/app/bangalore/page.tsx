import type { Metadata } from "next";
import CityEventsPage from "@/components/CityEventsPage";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Bangalore Events - Stranger Mingle | Weekend Meetups in Bangalore",
    description: "Browse upcoming offline events in Bangalore. Treks, workshops, social mixers, and more.",
};

export default function BangaloreEventsPage() {
    return <CityEventsPage cityName="Bangalore" />;
}
