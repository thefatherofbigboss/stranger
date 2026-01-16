export default function Testimonials() {
    const testimonials = [
        {
            name: "Alex M.",
            location: "United Kingdom",
            text: "I was feeling bored one night and stumbled upon this. Ended up talking to someone from Brazil for 2 hours about music. It was surprisingly wholesome!",
            rating: 5
        },
        {
            name: "Sarah K.",
            location: "Canada",
            text: "Love that you don't need to sign up. I hate giving my email to random sites. The interface is super clean too.",
            rating: 5
        },
        {
            name: "David R.",
            location: "Australia",
            text: "Better than the other random chat sites I've tried. Less bots, more real people. The video quality is solid.",
            rating: 4
        },
        {
            name: "Emily J.",
            location: "USA",
            text: "Met a gaming buddy here last week. We've been playing Valorant together ever since. 10/10 would recommend.",
            rating: 5
        },
        {
            name: "Michael T.",
            location: "Germany",
            text: "Simple, fast, and does what it says. The dark mode is easy on the eyes for late night chats.",
            rating: 5
        },
        {
            name: "Priya S.",
            location: "India",
            text: "A great way to practice English with native speakers. Everyone I've met has been friendly so far.",
            rating: 4
        }
    ];

    return (
        <div className="min-h-screen p-8 pt-32 max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    User Stories
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    See what people are saying about their experiences on Stranger Mingle.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl hover:border-blue-300 transition-colors shadow-sm">
                        <div className="flex text-yellow-500 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-gray-700 italic mb-6">"{t.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                                {t.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">{t.name}</div>
                                <div className="text-xs text-gray-500">{t.location}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
