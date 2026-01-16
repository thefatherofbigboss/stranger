export default function Contact() {
    return (
        <div className="min-h-screen p-8 pt-32 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Contact Us</h1>

            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-gray-300 mb-8 leading-relaxed">
                    Have questions, suggestions, or need assistance? We're here to help!
                    Reach out to our support team and we'll get back to you as soon as possible.
                </p>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Email Us</h3>
                            <p>support@strangermingle.com</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Response Time</h3>
                            <p>We usually reply within 24 hours.</p>
                        </div>
                    </div>
                </div>

                {/* Simple Contact Form UI (Non-functional for now) */}
                <form className="mt-12 space-y-4">
                    <h3 className="text-xl font-bold text-white mb-6">Send us a message</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Name" className="bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-500" />
                        <input type="email" placeholder="Email" className="bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-500" />
                    </div>
                    <textarea placeholder="Your Message" rows={4} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-500"></textarea>
                    <button type="button" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
