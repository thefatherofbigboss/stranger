import type { Metadata } from "next";
import CityEventsPage from "@/components/CityEventsPage";

export const metadata: Metadata = {
    title: "Pune Events - Stranger Mingle | Weekend Meetups in Pune",
    description: "Browse upcoming offline events in Pune. Treks, workshops, social mixers, and more.",
};

export default function PuneEventsPage() {
    return <CityEventsPage cityName="Pune" />;
}
