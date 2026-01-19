import type { Metadata } from "next";
import Image from "next/image";
import { getAllLiveEvents } from "@/lib/events";
import EventCard from "@/components/EventCard";
import RecentPosts from "@/components/RecentPosts";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Stranger Mingle — Meetups & Events in Pune, Mumbai, Bengaluru",
  description: "Curated stranger meetups, friendship groups, and events in Pune, Mumbai & Bengaluru. Small groups. Safe. Book tickets now.",
};

export default async function Home() {
  const events = await getAllLiveEvents();

  return (
    <div className="min-h-screen selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 flex flex-col items-center min-h-screen">

        {/* Hero Section */}
        <section className="relative w-full pt-32 pb-20 sm:pt-40 sm:pb-24 flex flex-col items-center text-center min-h-[600px] sm:min-h-[700px] overflow-hidden mb-20">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://res.cloudinary.com/dt3rse8bg/image/upload/v1768619953/group-young-successful-people-vacation-friends-enjoying-game-lake-positive-emotions_hycidp.jpg"
              alt="Friends having fun at a Stranger Mingle event"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-4xl mx-auto">
            <span className="px-4 py-2 rounded-full bg-blue-50/90 backdrop-blur-sm border border-blue-100 text-sm font-medium text-blue-600 inline-block mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              👋 New in Pune? Alone this weekend?
            </span>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 drop-shadow-lg">
              Make new Friends <br />Instantly <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-300 via-purple-300 to-pink-300">
                Stranger Meetups & Events
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 drop-shadow-md">
              Stranger Mingle is built to help people make real connections locally, not online. We create safe spaces where strangers meet and friendships begin through organized weekend events across Indian cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
              <a href="#events" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/25 hover:scale-105">
                See Upcoming Events
              </a>
              <a href="/about" className="px-8 py-4 bg-white/95 backdrop-blur-sm hover:bg-white text-gray-900 border border-white/20 rounded-xl font-bold text-lg transition-all hover:scale-105">
                Read Our Story
              </a>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section id="events" className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Upcoming Meetups</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Join a group this weekend. First-timers welcome; come alone (most people do)!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {events.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center">
            <a href="/events" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors">
              View all events <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </section>

        {/* Why Stranger Mingle Exists? */}
        <section className="w-full bg-gray-50 border-y border-gray-200 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
              Why Stranger Mingle Exists
            </h2>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16">
              We&apos;re solving a problem millions of Indians face: feeling lonely in a crowded city. Making friends after college shouldn&apos;t be this hard.
            </p>

            <div className="grid md:grid-cols-3 gap-8 sm:gap-12 mb-16">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
                  🏙️
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  You&apos;re Not Alone in Feeling Alone
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Moved to a new city? Lost touch with college friends? Working from home with no social life? You&apos;re surrounded by millions, yet eating dinner alone. We get it—because we&apos;ve been there too.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
                  🤝
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Real Connections, Not Online Chats
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Friendships happen when you&apos;re doing something together, not swiping through profiles. We create real spaces—chai circles, treks, game nights—where genuine bonds form naturally.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center text-3xl mb-6">
                  🛡️
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Safe Spaces for Everyone
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  We don&apos;t judge by caste, class, colour, or background. Zero tolerance for harassment. Verified members only. Small groups where everyone matters. This is where India makes friends the right way.
                </p>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-8 sm:p-12 border border-blue-100">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                How It Works
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-sm">
                    1
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Pick Your Event
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Browse weekend events—casual meetups, treks, cultural walks. Choose what excites you. Events are priced fairly to keep things sustainable.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white text-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-sm">
                    2
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Just Show Up
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Come alone—80% of people do. We handle the awkward part with structured ice-breakers. Small groups (25-30 people) mean real conversations.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white text-pink-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-sm">
                    3
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Build Real Friendships
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    Exchange numbers. Make plans. Show up to the next event. Friendships take time, but they start with showing up once.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial / Social Proof */}
        <section className="w-full max-w-5xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-500 mb-10 tracking-wide uppercase">Trusted by 2,000+ Punekars</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">&quot;Moved to Pune for my job and knew literally no one. Went to the Sunday Chai event thinking it would be awkward, but met 3 people who are now my regular trekking group. Best decision ever.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">R</div>
                <div>
                  <div className="font-bold text-gray-900">Rahul Deshmukh</div>
                  <div className="text-xs text-gray-500">Software Engineer, Hinjewadi</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">&quot;Apps just weren&apos;t working for me. I wanted to meet people naturally. The board game night was so much fun, and I didn&apos;t have to worry about forcing conversation.&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">P</div>
                <div>
                  <div className="font-bold text-gray-900">Priya Sharma</div>
                  <div className="text-xs text-gray-500">Student, Symbiosis</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety / Values */}
        <section className="w-full max-w-7xl mx-auto px-4 py-12 mb-20">
          <div className="bg-linear-to-r from-blue-900/10 to-purple-900/10 border border-white/10 rounded-3xl p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">A Community Built on Trust</h2>
              <p className="text-gray-600 text-lg">
                We verify every member to keep our events safe and comfortable. We have a zero-tolerance policy for harassment. Our goal is to create the safest space in Pune to meet strangers.
              </p>
            </div>
            <a href="/about" className="whitespace-nowrap px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-bold text-lg transition-colors">
              Read Our Guidelines
            </a>
          </div>
        </section>

        {/* Recent Blog Posts */}
        <section className="w-full max-w-7xl mx-auto px-4 py-20">
          <RecentPosts limit={4} />
        </section>

      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Stranger Mingle",
              "url": "https://www.strangermingle.com",
              "description": "Make real friends in Pune through offline weekend events and meetups.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.strangermingle.com/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.strangermingle.com"
              }]
            }
          ]),
        }}
      />
    </div>
  );
}