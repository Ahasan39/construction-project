import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

type CmsServiceItem = {
    id: number;
    title: string;
    slug: string;
    category?: string;
    description: string;
    features?: string[];
    price_starting?: string;
    is_active: boolean;
};

type CmsLocationItem = {
    id: number;
    city: string;
    state: string;
    slug: string;
    phone?: string;
    address?: string;
};

type CmsTestimonialItem = {
    id: number;
    author: string;
    city_state?: string;
    rating: number;
    service?: string;
    body: string;
    is_featured: boolean;
};

type CmsArticleItem = {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    category?: string;
    author?: string;
    read_time?: string;
    published_at?: string;
};

type WelcomeProps = {
    appName: string;
    services: CmsServiceItem[];
    locations: CmsLocationItem[];
    testimonials: CmsTestimonialItem[];
    articles: CmsArticleItem[];
    contact: {
        phone: string;
        email: string;
        address: string;
    };
};

const defaultServices = [
    {
        title: 'Roof Replacement & Repair',
        desc: 'Factory-certified GAF Master Elite installation. Architectural shingles, metal, and flat roofing with lifetime warranties.',
        icon: '🏠',
        tag: 'Done in One Day',
    },
    {
        title: 'Vinyl & Fiber Cement Siding',
        desc: 'High-performance insulated siding built to resist extreme wind, hail, and moisture while boosting curb appeal.',
        icon: '🧱',
        tag: 'Insulated & Durable',
    },
    {
        title: 'Energy-Efficient Windows',
        desc: 'Double and triple-pane custom replacement windows designed to reduce energy costs and enhance indoor comfort.',
        icon: '🪟',
        tag: 'ENERGY STAR®',
    },
    {
        title: 'Seamless Gutters & Guards',
        desc: 'Custom continuous-roll aluminum gutters and micro-mesh gutter guards to prevent water intrusion and foundation damage.',
        icon: '🌧️',
        tag: 'Clog-Free Guarantee',
    },
    {
        title: 'Masonry & Chimney Services',
        desc: 'Expert tuckpointing, chimney rebuilds, brick repair, and flashing restoration by licensed masonry artisans.',
        icon: '🏗️',
        tag: 'Artisan Quality',
    },
    {
        title: 'Commercial Roofing Solutions',
        desc: 'TPO, EPDM, PVC, and roof coatings for commercial facilities, multi-family units, and industrial properties.',
        icon: '🏢',
        tag: 'Commercial Grade',
    },
];

export default function Welcome({ appName, services, locations, testimonials, articles, contact }: WelcomeProps) {
    const [leadName, setLeadName] = useState('');
    const [leadPhone, setLeadPhone] = useState('');
    const [leadEmail, setLeadEmail] = useState('');
    const [leadService, setLeadService] = useState('Roofing');
    const [leadNotes, setLeadNotes] = useState('');
    const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [leadMessage, setLeadMessage] = useState('');

    async function handleLeadSubmit(e: FormEvent) {
        e.preventDefault();
        setLeadStatus('submitting');
        setLeadMessage('');

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/api/v1/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify({
                    name: leadName,
                    phone: leadPhone,
                    email: leadEmail,
                    service: leadService,
                    notes: leadNotes,
                }),
            });

            if (res.ok) {
                setLeadStatus('success');
                setLeadMessage('Thank you! Your free inspection estimate request has been submitted. Our team will contact you shortly.');
                setLeadName('');
                setLeadPhone('');
                setLeadEmail('');
                setLeadNotes('');
            } else {
                const data = await res.json().catch(() => null);
                setLeadStatus('error');
                setLeadMessage(data?.message || 'Something went wrong. Please check your contact information and try again.');
            }
        } catch {
            setLeadStatus('error');
            setLeadMessage('Unable to reach server. Please call us directly at ' + (contact?.phone || '1-800-4-MR-ROOF'));
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-red-500 selection:text-white">
            <Head>
                <title>{appName} — Residential & Commercial Exterior Specialists</title>
                <meta
                    name="description"
                    content="America's premier exterior contractor for roofing, siding, windows, and gutters. Lifetime warranty protection and same-day estimates."
                />
            </Head>

            {/* Top Announcement Bar */}
            <header className="border-b border-slate-800 bg-[#0f2231] text-xs text-slate-300">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Emergency 24/7 Response Available
                        </span>
                        <span className="hidden sm:inline text-slate-400">|</span>
                        <span className="hidden sm:inline">Certified Master Elite Installers</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <a href={`tel:${contact?.phone || '1-800-467-7663'}`} className="font-semibold text-white hover:text-red-400 transition">
                            📞 {contact?.phone || '1-800-4-MR-ROOF'}
                        </a>
                        <Link
                            href="/admin"
                            className="rounded bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition"
                        >
                            Admin Portal →
                        </Link>
                    </div>
                </div>
            </header>

            {/* Navigation Header */}
            <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d9232a] text-xl font-bold text-white shadow-sm">
                            MR
                        </div>
                        <div>
                            <span className="text-xl font-extrabold tracking-tight text-[#0f2231]">
                                MR. ROOF
                            </span>
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                Construction & Remodeling
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-700">
                        <a href="#services" className="hover:text-[#d9232a] transition">Services</a>
                        <a href="#about" className="hover:text-[#d9232a] transition">Why Us</a>
                        <a href="#estimate" className="hover:text-[#d9232a] transition">Free Estimate</a>
                        <a href="#testimonials" className="hover:text-[#d9232a] transition">Reviews</a>
                        <Link href="/inertia-check" className="hover:text-[#d9232a] transition text-slate-500">
                            Diagnostic
                        </Link>
                    </div>

                    <div className="flex items-center space-x-3">
                        <a
                            href="#estimate"
                            className="rounded-md bg-[#d9232a] px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-[#b81b22] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                        >
                            Get Free Estimate
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-[#0f2231] to-slate-900 py-20 text-white sm:py-28">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-7">
                            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-semibold text-red-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                                Over 60 Years of Uncompromised Excellence
                            </div>
                            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                Built to Protect. <br />
                                <span className="text-[#d9232a]">Guaranteed for Life.</span>
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                                Most roofs inspected, permitted, and completely replaced in a single day. Backed by our exclusive Lifetime Material & Workmanship Warranty and factory-direct pricing.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <a
                                    href="#estimate"
                                    className="rounded-md bg-[#d9232a] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-red-500/25 hover:bg-[#b81b22] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                                >
                                    Claim Your Free Inspection
                                </a>
                                <a
                                    href="#services"
                                    className="rounded-md border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-base font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                                >
                                    Explore Solutions
                                </a>
                            </div>

                            {/* Trust badges */}
                            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-slate-800 pt-8 sm:grid-cols-4">
                                <div>
                                    <p className="text-2xl font-bold text-white">1 Day</p>
                                    <p className="text-xs text-slate-400">Standard roof installation</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">Lifetime</p>
                                    <p className="text-xs text-slate-400">Material & labor warranty</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">250k+</p>
                                    <p className="text-xs text-slate-400">Happy homeowners served</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">A+ BBB</p>
                                    <p className="text-xs text-slate-400">Accredited excellence</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Quote Form Card */}
                        <div id="estimate" className="lg:col-span-5">
                            <div className="rounded-2xl border border-slate-700 bg-white p-6 shadow-2xl sm:p-8 text-slate-900">
                                <h2 className="text-2xl font-bold text-[#0f2231]">
                                    Request Free Estimate
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    No obligation, zero pressure inspection & exact quote.
                                </p>

                                {leadStatus === 'success' ? (
                                    <div className="mt-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-800">
                                        <p className="font-semibold text-sm">✓ Success!</p>
                                        <p className="mt-1 text-xs">{leadMessage}</p>
                                        <button
                                            type="button"
                                            onClick={() => setLeadStatus('idle')}
                                            className="mt-3 text-xs font-semibold text-emerald-900 underline"
                                        >
                                            Submit another request
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleLeadSubmit} className="mt-6 space-y-4">
                                        {leadStatus === 'error' && (
                                            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                                                {leadMessage}
                                            </div>
                                        )}

                                        <div>
                                            <label htmlFor="lead-name" className="block text-xs font-semibold text-slate-700">Full Name *</label>
                                            <input
                                                id="lead-name"
                                                type="text"
                                                required
                                                value={leadName}
                                                onChange={(e) => setLeadName(e.target.value)}
                                                placeholder="e.g. John Doe"
                                                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="lead-phone" className="block text-xs font-semibold text-slate-700">Phone Number *</label>
                                                <input
                                                    id="lead-phone"
                                                    type="tel"
                                                    required
                                                    value={leadPhone}
                                                    onChange={(e) => setLeadPhone(e.target.value)}
                                                    placeholder="(555) 000-0000"
                                                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="lead-email" className="block text-xs font-semibold text-slate-700">Email Address *</label>
                                                <input
                                                    id="lead-email"
                                                    type="email"
                                                    required
                                                    value={leadEmail}
                                                    onChange={(e) => setLeadEmail(e.target.value)}
                                                    placeholder="john@example.com"
                                                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="lead-service" className="block text-xs font-semibold text-slate-700">Primary Service *</label>
                                            <select
                                                id="lead-service"
                                                value={leadService}
                                                onChange={(e) => setLeadService(e.target.value)}
                                                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                            >
                                                <option value="Roofing">Roofing (Replacement or Repair)</option>
                                                <option value="Siding">Siding (Vinyl or Fiber Cement)</option>
                                                <option value="Windows">Replacement Windows</option>
                                                <option value="Gutters">Seamless Gutters & Guards</option>
                                                <option value="Masonry">Masonry & Chimney</option>
                                                <option value="Commercial">Commercial Project</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="lead-notes" className="block text-xs font-semibold text-slate-700">Project Notes (Optional)</label>
                                            <textarea
                                                id="lead-notes"
                                                rows={2}
                                                value={leadNotes}
                                                onChange={(e) => setLeadNotes(e.target.value)}
                                                placeholder="Tell us about leaks, age of roof, storm damage, or preferred time…"
                                                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={leadStatus === 'submitting'}
                                            className="w-full rounded-md bg-[#d9232a] py-3 text-center text-sm font-bold text-white shadow hover:bg-[#b81b22] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition"
                                        >
                                            {leadStatus === 'submitting' ? 'Submitting Details…' : 'Schedule My Free Inspection'}
                                        </button>
                                        <p className="text-center text-[11px] text-slate-500">
                                            🔒 We respect your privacy. No spam. You will be contacted only regarding this project inquiry.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Services Section */}
            <section id="services" className="py-20 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#d9232a]">
                            Premium Craftsmanship
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0f2231] sm:text-4xl">
                            Complete Exterior Renovation Services
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                            Engineered for durability, energy efficiency, and long-lasting protection against wind, rain, and snow.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {services && services.length > 0 ? (
                            services.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition"
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl">🔨</span>
                                            {item.category && (
                                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                                                    {item.category}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="mt-4 text-xl font-bold text-[#0f2231] group-hover:text-[#d9232a] transition">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs font-semibold text-[#d9232a]">
                                        <span>Free Estimate Available</span>
                                        <a href="#estimate" className="hover:underline">Schedule →</a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            defaultServices.map((item) => (
                                <div
                                    key={item.title}
                                    className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition"
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl">{item.icon}</span>
                                            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-[#d9232a]">
                                                {item.tag}
                                            </span>
                                        </div>
                                        <h3 className="mt-4 text-xl font-bold text-[#0f2231] group-hover:text-[#d9232a] transition">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs font-semibold text-[#d9232a]">
                                        <span>Lifetime Warranty</span>
                                        <a href="#estimate" className="hover:underline">Get Quote →</a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section id="about" className="bg-[#0f2231] py-20 text-white sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#d9232a]">
                                The Mr. Roof Difference
                            </span>
                            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Why More Homeowners Choose Us
                            </h2>
                            <p className="mt-4 text-base text-slate-300">
                                We hold ourselves to a higher standard of craftsmanship, honesty, and safety. Every crew is factory-trained, certified, and dedicated to leaving your property cleaner than we found it.
                            </p>

                            <dl className="mt-8 space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400 font-bold">
                                        ✓
                                    </div>
                                    <div>
                                        <dt className="text-base font-bold text-white">Same-Day Completion</dt>
                                        <dd className="mt-1 text-sm text-slate-300">
                                            Most roofs are stripped, prepped, re-shingled, and thoroughly inspected in a single working day.
                                        </dd>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400 font-bold">
                                        ✓
                                    </div>
                                    <div>
                                        <dt className="text-base font-bold text-white">Non-Prorated Lifetime Coverage</dt>
                                        <dd className="mt-1 text-sm text-slate-300">
                                            True protection covering materials and labor, transferable to the next homeowner for added resale value.
                                        </dd>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400 font-bold">
                                        ✓
                                    </div>
                                    <div>
                                        <dt className="text-base font-bold text-white">Clean Yard Guarantee</dt>
                                        <dd className="mt-1 text-sm text-slate-300">
                                            High-powered magnetic sweeps protect your family and pets from stray nails and debris.
                                        </dd>
                                    </div>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-8">
                            <h3 className="text-xl font-bold text-white">Service Areas & Regional Hubs</h3>
                            <p className="mt-2 text-sm text-slate-300">
                                Proudly serving homeowners across multiple states and regional service territories:
                            </p>
                            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                                {locations && locations.length > 0 ? (
                                    locations.map((loc) => (
                                        <div key={loc.id} className="rounded-lg bg-slate-800 p-3 border border-slate-700">
                                            <p className="font-bold text-white">{loc.city}, {loc.state}</p>
                                            <p className="text-xs text-slate-400">{loc.phone || contact?.phone || '1-800-4-MR-ROOF'}</p>
                                        </div>
                                    ))
                                ) : (
                                    ['Nashville, TN', 'Cincinnati, OH', 'Columbus, OH', 'Louisville, KY', 'Ann Arbor, MI', 'Grand Rapids, MI'].map((loc) => (
                                        <div key={loc} className="rounded-lg bg-slate-800 p-3 border border-slate-700">
                                            <p className="font-bold text-white">{loc}</p>
                                            <p className="text-xs text-slate-400">Available Mon-Sat</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-700 text-center">
                                <a
                                    href="#estimate"
                                    className="inline-block rounded-md bg-[#d9232a] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#b81b22] transition"
                                >
                                    Check Availability in Your Area
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#d9232a]">
                            Verified Homeowners
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0f2231] sm:text-4xl">
                            What Our Customers Say
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials && testimonials.length > 0 ? (
                            testimonials.map((t) => (
                                <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex text-amber-400">
                                        {'★'.repeat(t.rating || 5)}
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-slate-700 italic">
                                        "{t.body}"
                                    </p>
                                    <div className="mt-6 border-t border-slate-100 pt-3">
                                        <p className="text-sm font-bold text-[#0f2231]">{t.author}</p>
                                        <p className="text-xs text-slate-500">{t.city_state || 'Verified Customer'}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            [
                                {
                                    author: 'Robert K.',
                                    loc: 'Nashville, TN',
                                    text: 'They showed up at 7:30 AM, tore off the old three-tab shingles, replaced three sheets of damaged decking, and were completely cleaned up by 4:00 PM. Incredible workmanship.',
                                },
                                {
                                    author: 'Jennifer M.',
                                    loc: 'Cincinnati, OH',
                                    text: 'Our energy bill dropped significantly after installing their insulated siding and replacement windows. The team was courteous and communicative from start to finish.',
                                },
                                {
                                    author: 'David L.',
                                    loc: 'Columbus, OH',
                                    text: 'Best warranty in the business. The inspector walked the roof with me, took photos, explained every option, and never pressured me. Highly recommend Mr. Roof.',
                                },
                            ].map((item) => (
                                <div key={item.author} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex text-amber-400">★★★★★</div>
                                    <p className="mt-3 text-sm leading-6 text-slate-700 italic">
                                        "{item.text}"
                                    </p>
                                    <div className="mt-6 border-t border-slate-100 pt-3">
                                        <p className="text-sm font-bold text-[#0f2231]">{item.author}</p>
                                        <p className="text-xs text-slate-500">{item.loc}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Articles / Blog Section */}
            {articles && articles.length > 0 && (
                <section className="bg-slate-100 py-16 border-t border-slate-200">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-[#0f2231]">Roofing & Exterior Guides</h2>
                                <p className="text-sm text-slate-600">Educational advice from certified contractor specialists.</p>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {articles.map((art) => (
                                <div key={art.id} className="rounded-lg bg-white p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <span className="text-xs font-semibold text-[#d9232a] uppercase">{art.category || 'Article'}</span>
                                        <h3 className="mt-2 text-base font-bold text-slate-900">{art.title}</h3>
                                        {art.excerpt && <p className="mt-2 text-xs text-slate-600 line-clamp-2">{art.excerpt}</p>}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                        <span>{art.author || 'Editorial Team'}</span>
                                        <span>{art.read_time || '4 min read'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-[#0a1823] text-slate-400">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="flex items-center space-x-2 text-white font-bold text-lg">
                                <span className="flex h-7 w-7 items-center justify-center rounded bg-[#d9232a] text-sm">MR</span>
                                <span>MR. ROOF</span>
                            </div>
                            <p className="mt-3 text-xs leading-5 text-slate-400">
                                Trusted residential and commercial exterior contractor specializing in lifetime roof replacements, siding, windows, and seamless gutters.
                            </p>
                            <p className="mt-4 text-xs font-semibold text-white">
                                Emergency Contact: {contact?.phone || '1-800-4-MR-ROOF'}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
                            <ul className="mt-3 space-y-2 text-xs">
                                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                                <li><a href="#about" className="hover:text-white transition">Why Choose Us</a></li>
                                <li><a href="#estimate" className="hover:text-white transition">Free Inspection</a></li>
                                <li><a href="#testimonials" className="hover:text-white transition">Customer Reviews</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Platform & Admin</h4>
                            <ul className="mt-3 space-y-2 text-xs">
                                <li>
                                    <Link href="/admin" className="text-red-400 hover:text-red-300 font-semibold transition">
                                        Admin CMS Portal →
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/inertia-check" className="hover:text-white transition">
                                        Inertia Diagnostic Check
                                    </Link>
                                </li>
                                <li>
                                    <a href="/api/v1/health" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                                        System Health JSON (/api/v1/health)
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Office Details</h4>
                            <p className="mt-3 text-xs text-slate-400">
                                {contact?.address || '123 Construction Way, Suite 100'}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Email: {contact?.email || 'contact@mrroof.com'}
                            </p>
                            <p className="mt-3 text-[11px] text-slate-500">
                                Licensed, Bonded & Insured. All rights reserved.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
                        © {new Date().getFullYear()} {appName}. Reproduction exterior contractor demonstration.
                    </div>
                </div>
            </footer>
        </div>
    );
}
