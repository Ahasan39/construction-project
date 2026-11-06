import { Head } from '@inertiajs/react';
import { Hero } from '@/components/sections/Hero';
import { ProtectBand } from '@/components/sections/ProtectBand';
import { WhyUs } from '@/components/sections/WhyUs';
import { ServiceCards } from '@/components/sections/ServiceCards';
import { PromotionsRow } from '@/components/sections/PromotionsRow';
import { ReviewsStrip } from '@/components/sections/ReviewsStrip';
import { AwardsStrip } from '@/components/sections/AwardsStrip';
import { PublicLayout } from '@/layouts/PublicLayout';

type CmsServiceItem = {
    id: number;
    name?: string;
    title?: string;
    slug: string;
    category?: string;
    tagline?: string;
    description?: string;
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
    author_name?: string;
    author?: string;
    read_time?: string;
    published_at?: string;
};

export type WelcomeProps = {
    appName?: string | null;
    services?: CmsServiceItem[] | null;
    locations?: CmsLocationItem[] | null;
    testimonials?: CmsTestimonialItem[] | null;
    articles?: CmsArticleItem[] | null;
    contact?: {
        phone?: string | null;
        email?: string | null;
        address?: string | null;
    } | null;
    settings?: Record<string, unknown> | null;
};

const renderRatingStars = (rating: unknown): string => {
    const numeric = typeof rating === 'number' ? rating : Number(rating);
    const count = Number.isFinite(numeric) ? Math.max(1, Math.min(5, Math.floor(numeric))) : 5;
    return '★'.repeat(count);
};

export default function Welcome({
    appName = 'Mr. Roof Construction Project',
    services: _services = [],
    locations: _locations = [],
    testimonials = [],
    articles: _articles = [],
    contact: _contact = {},
    settings: _settings = {},
}: WelcomeProps = {}) {
    const safeAppName = appName || 'Mr. Roof Construction Project';
    const safeTestimonials = testimonials ?? [];

    return (
        <PublicLayout>
            <Head title={`${safeAppName} — Residential exterior contractor`} />
            <Hero />
            <ProtectBand />
            <WhyUs />
            <ServiceCards />
            <PromotionsRow />
            <ReviewsStrip />

            {/* Dynamic Customer Testimonials from CMS */}
            {safeTestimonials.length > 0 && (
                <section
                    aria-label="Customer Testimonials"
                    className="py-12 bg-[#F4F6F8] border-b border-slate-200"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#0284c7] mb-1">
                                Verified Feedback
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2231]">
                                What Homeowners Say About Mr. Roof
                            </h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-3">
                            {safeTestimonials.map((t, idx) => (
                                <div
                                    key={t?.id ?? idx}
                                    className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center gap-1 text-amber-500 mb-2 font-mono">
                                            {renderRatingStars(t?.rating)}
                                        </div>
                                        <p className="text-slate-700 text-sm leading-relaxed mb-4">
                                            "{t?.body || 'Exceptional craftsmanship and professional service from start to finish.'}"
                                        </p>
                                    </div>
                                    <div className="border-t border-slate-100 pt-3">
                                        <p className="font-semibold text-slate-900 text-sm">
                                            {t?.author || 'Verified Customer'}
                                        </p>
                                        {t?.city_state && (
                                            <p className="text-xs text-slate-500">
                                                {t.city_state}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <AwardsStrip />
        </PublicLayout>
    );
}
