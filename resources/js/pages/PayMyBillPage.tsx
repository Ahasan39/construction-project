import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applyRouteMeta } from "@/app/seo";
import { Container } from "@/components/ui";
import { brand } from "@/data/brand";

export default function PayMyBillPage() {
  useEffect(() => {
    applyRouteMeta({
      title: "Pay My Bill",
      description:
        "Pay-my-bill entry point. This frontend reproduction does not process payments; the real payment portal URL is not configured.",
      canonicalPath: "/billpay/",
    });
  }, []);

  return (
    <>
      <section
        aria-labelledby="billpay-title"
        className="bg-[#F4F6F8] border-b border-[var(--color-border)]"
      >
        <Container width="wide" className="py-14 sm:py-20 lg:py-24">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span aria-hidden="true"> › </span>
            <span>Pay My Bill</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Billing &amp; payments
          </p>
          <h1
            id="billpay-title"
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-primary)] leading-tight"
          >
            Pay my bill.
          </h1>
          <p className="mt-4 text-slate-700 text-base leading-relaxed max-w-3xl">
            Our billing team handles invoice payments directly by phone to
            keep card and bank details off the public web. Call the number in
            the footer and a team member will take payment or send the
            appropriate link for your invoice.
          </p>
        </Container>
      </section>

      <section
        aria-labelledby="billpay-status-title"
        className="bg-white"
      >
        <Container width="content" className="py-12 sm:py-16">
          <h2
            id="billpay-status-title"
            className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-brand-primary)]"
          >
            How to pay
          </h2>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed">
            For payment on an existing invoice, call our team directly. We
            keep card and bank information off the public site for your
            security — payment is handled by phone or through a secure link
            we send you.
          </p>

          <h3 className="mt-8 text-base font-bold text-[var(--color-brand-primary)]">
            Why there is no form here
          </h3>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            Payment information belongs with a payment processor under
            contract with our business, not a public web page. We take
            payment by phone and only ask for payment details through a
            secure channel.
          </p>

          <h3 className="mt-8 text-base font-bold text-[var(--color-brand-primary)]">
            Reach the team
          </h3>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            Phone:{" "}
            <a
              href={brand.phoneHref}
              className="font-bold text-[var(--color-brand-accent)] hover:underline"
            >
              {brand.phoneDisplay}
            </a>{" "}
            — or email{" "}
            <a
              href={brand.emailHref}
              className="font-semibold text-[var(--color-brand-primary)] hover:underline break-all"
            >
              {brand.email}
            </a>{" "}
            and we will follow up with the right payment route for your
            invoice.
          </p>
        </Container>
      </section>
    </>
  );
}
