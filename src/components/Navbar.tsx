import Link from 'next/link';

export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100/50">
            <nav className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-500/20">
                        S
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900">Stranger Mingle</span>
                </Link>
                <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
                    <Link href="/pune" className="hover:text-black transition-colors hidden md:block">
                        Pune
                    </Link>
                    <Link href="/mumbai" className="hover:text-black transition-colors hidden md:block">
                        Mumbai
                    </Link>
                    <Link href="/delhi" className="hover:text-black transition-colors hidden md:block">
                        Delhi
                    </Link>
                    <Link href="/bangalore" className="hover:text-black transition-colors hidden md:block">
                        Bangalore
                    </Link>
                    <Link href="/events" className="hover:text-black transition-colors hidden sm:block">
                        Events
                    </Link>
                    <Link href="/about" className="hover:text-black transition-colors hidden sm:block">
                        About
                    </Link>
                    <Link href="/contact" className="hover:text-black transition-colors hidden sm:block">
                        Contact
                    </Link>
                    <Link href="/sign-up" className="px-4 py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors">
                        Sign Up
                    </Link>
                </div>
            </nav>
        </header>
    );
}
