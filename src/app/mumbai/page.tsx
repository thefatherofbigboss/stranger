import type { Metadata } from "next";
import CityEventsPage from "@/components/CityEventsPage";

export const metadata: Metadata = {
    title: "Mumbai Events - Stranger Mingle | Weekend Meetups in Mumbai",
    description: "Browse upcoming offline events in Mumbai. Treks, workshops, social mixers, and more.",
};

export default function MumbaiEventsPage() {
    return <CityEventsPage cityName="Mumbai" />;
}
