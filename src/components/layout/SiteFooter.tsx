import { assetUrl } from "@/app/assets";
import { Link } from "react-router-dom";
import { Container, SmartLink } from "@/components/ui";
import { services } from "@/data/services";
import { locations } from "@/data/locations";
import { brand } from "@/data/brand";
import { listArticleSummaries } from "@/data/articles";

/**
 * Reconstructed dark-navy public footer matching mrroof.com:
 * - Deeper dark navy background (#071524), distinct from Awards section navy (#0C1F33).
 * - Top contact row with white logo, phone, and filled red CTA ("Get a Free Estimate").
 * - Reference red group headings (#D9232A) for all column sections.
 * - Distinct boxed container backgrounds for Recent Posts (#0C1F33).
 * - Exact reference columns: Services, Service Areas, Resources, Company, Recent Posts.
 */
export function SiteFooter() {
  const recent = listArticleSummaries().slice(0, 2);

  return (
    <footer className="bg-[#071524] text-white">
      {/* Top footer row with logo, phone and CTA matching reference */}
      <div className="border-b border-slate-800/80 py-8">
        <Container width="wide">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link to="/" aria-label={`${brand.companyName} — Home`} className="shrink-0 inline-block">
              <img
                src={assetUrl("/images/logo-white.svg")}
                alt={`${brand.companyName} Logo`}
                width={180}
                height={44}
                style={{ aspectRatio: "180 / 44" }}
                className="h-10 lg:h-11 w-auto max-w-[180px] lg:max-w-[210px] shrink-0 object-contain"
              />
            </Link>

            <div className="flex flex-wrap items-center gap-6">
              <SmartLink
                to={brand.phoneHref}
                external
                className="text-xl sm:text-2xl font-black text-white hover:text-[var(--color-brand-accent)] transition-colors"
              >
                {brand.phoneDisplay}
              </SmartLink>

              <Link
                to="/free-estimate"
                className="inline-flex items-center justify-center h-11 px-6 rounded-sm bg-[#D9232A] hover:bg-[#B81B22] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-colors shadow-sm"
              >
                Get a Free Estimate
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main column links grid */}
      <Container width="wide" className="py-12 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 text-sm">
          <FooterColumn title="Services">
            <ul className="space-y-2.5 text-slate-300">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/${s.slug}`} className="hover:text-white hover:underline transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Service Areas">
            <ul className="space-y-2 text-slate-300">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link to={`/${loc.slug}`} className="hover:text-white hover:underline transition-colors">
                    {loc.city}, {loc.state}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Resources">
            <ul className="space-y-2.5 text-slate-300">
              <li><Link to="/special-offers" className="hover:text-white hover:underline transition-colors">Special Offers</Link></li>
              <li><Link to="/billpay" className="hover:text-white hover:underline transition-colors">Pay My Bill</Link></li>
              <li><Link to="/financing" className="hover:text-white hover:underline transition-colors">Financing</Link></li>
              <li><Link to="/warranties" className="hover:text-white hover:underline transition-colors">Warranties</Link></li>
              <li><Link to="/refer-a-friend" className="hover:text-white hover:underline transition-colors">Refer a Friend</Link></li>
              <li><Link to="/commercial-projects" className="hover:text-white hover:underline transition-colors">Commercial Projects</Link></li>
            </ul>
          </FooterColumn>

          <FooterColumn title="Company">
            <ul className="space-y-2.5 text-slate-300">
              <li><Link to="/about" className="hover:text-white hover:underline transition-colors">About Us</Link></li>
              <li><Link to="/reviews" className="hover:text-white hover:underline transition-colors">Customer Reviews</Link></li>
              <li><Link to="/careers/sales" className="hover:text-white hover:underline transition-colors">Sales Careers</Link></li>
              <li><Link to="/blog" className="hover:text-white hover:underline transition-colors">Blog</Link></li>
            </ul>
          </FooterColumn>

          <FooterColumn title="Recent Posts">
            {recent.length === 0 ? (
              <p className="text-slate-400 text-xs">
                Articles pending publication.
              </p>
            ) : (
              <ul className="space-y-3">
                {recent.map((a) => (
                  <li key={a.slug} className="bg-[#0C1F33] p-3 rounded-sm border border-slate-750">
                    <Link
                      to={`/blog/${a.slug}`}
                      className="text-xs font-semibold text-white hover:text-[var(--color-brand-blue)] line-clamp-2 leading-snug mb-1.5 block"
                    >
                      {a.title}
                    </Link>
                    <Link
                      to={`/blog/${a.slug}`}
                      className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      Read More »
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3">
              <Link to="/blog" className="text-xs font-bold text-[#00A3E0] hover:underline uppercase tracking-wider">
                View Blog &gt;&gt;
              </Link>
            </p>
          </FooterColumn>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/80 bg-[#050E18]">
        <Container width="wide" className="py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-slate-400">
            <p>{brand.legalLine}</p>
            <ul className="flex items-center gap-6">
              <li>
                <Link to="/privacy-policy" className="hover:text-white hover:underline transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/crew" className="hover:text-white hover:underline transition-colors">
                  Crew Portal
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#FF4D4D]">
        {title}
      </h3>
      {children}
    </section>
  );
}

