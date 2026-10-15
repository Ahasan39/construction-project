import { Link } from "react-router-dom";
import { Button, Container, SmartLink } from "@/components/ui";
import { services } from "@/data/services";
import { locations } from "@/data/locations";
import { brand } from "@/data/brand";
import { listArticleSummaries } from "@/data/articles";

/**
 * Dark-navy public footer informed by the supplied reference screenshot:
 * brand/contact block on the left, four data-driven column groups
 * (Services, Service Areas, Company, Recent Posts), social + legal in the
 * bottom bar. Palette, column counts and vertical rhythm are provisional
 * until live measurement.
 */
export function SiteFooter() {
  const recent = listArticleSummaries().slice(0, 2);

  return (
    <footer className="bg-[var(--color-brand-primary)] text-white">
      <Container width="wide" className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          {/* Brand + CTA column */}
          <section className="flex flex-col gap-4" aria-label="Contact">
            <p className="text-2xl font-extrabold tracking-tight">
              <span className="text-[var(--color-brand-accent)]">
                {brand.companyName.split(" ")[0]}
              </span>
              {brand.companyName.split(" ").slice(1).join(" ") && (
                <span className="text-white">
                  {" " + brand.companyName.split(" ").slice(1).join(" ")}
                </span>
              )}
            </p>
            <p className="text-sm text-white/80">
              Roofing, siding, windows, gutters, masonry.
            </p>
            <p className="text-sm">
              <SmartLink
                to={brand.phoneHref}
                external
                className="text-xl font-extrabold text-[var(--color-brand-accent)] hover:underline"
              >
                {brand.phoneDisplay}
              </SmartLink>
            </p>
            <p className="text-sm">
              <SmartLink
                to={`mailto:${brand.email}`}
                external
                className="underline text-white/90"
              >
                {brand.email}
              </SmartLink>
            </p>
            <div>
              <Link to="/free-estimate">
                <Button size="md">Free estimate</Button>
              </Link>
            </div>
          </section>

          <FooterColumn title="Services">
            <ul className="space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/${s.slug}`} className="text-white/85 hover:text-white hover:underline">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Service Areas">
            <ul className="space-y-2 text-sm">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link to={`/${loc.slug}`} className="text-white/85 hover:text-white hover:underline">
                    {loc.city}, {loc.state}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Company">
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-white/85 hover:text-white hover:underline">About</Link></li>
              <li><Link to="/reviews" className="text-white/85 hover:text-white hover:underline">Customer Reviews</Link></li>
              <li><Link to="/special-offers" className="text-white/85 hover:text-white hover:underline">Special Offers</Link></li>
              <li><Link to="/financing" className="text-white/85 hover:text-white hover:underline">Financing</Link></li>
              <li><Link to="/warranties" className="text-white/85 hover:text-white hover:underline">Warranties</Link></li>
              <li><Link to="/refer-a-friend" className="text-white/85 hover:text-white hover:underline">Refer a Friend</Link></li>
              <li><Link to="/commercial-projects" className="text-white/85 hover:text-white hover:underline">Commercial Projects</Link></li>
              <li><Link to="/careers/sales" className="text-white/85 hover:text-white hover:underline">Sales Careers</Link></li>
              <li><Link to="/billpay" className="text-white/85 hover:text-white hover:underline">Pay My Bill</Link></li>
            </ul>
          </FooterColumn>

          <FooterColumn title="Recent Posts">
            {recent.length === 0 ? (
              <p className="text-sm text-white/70">
                Posts pending content delivery.
              </p>
            ) : (
              <ul className="space-y-3 text-sm">
                {recent.map((a) => (
                  <li key={a.slug}>
                    <Link to={`/blog/${a.slug}`} className="text-white/85 hover:text-white hover:underline">
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3">
              <Link to="/blog" className="text-sm font-medium underline">
                View all posts →
              </Link>
            </p>
          </FooterColumn>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/15 bg-black/15">
        <Container width="wide" className="py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-white/75">
            <p>{brand.legalLine}</p>
            <ul className="flex items-center gap-5">
              <li>
                <Link to="/privacy-policy" className="hover:text-white hover:underline">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/crew" className="hover:text-white hover:underline">
                  Crew portal
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
      <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-white">
        {title}
      </h3>
      {children}
    </section>
  );
}
