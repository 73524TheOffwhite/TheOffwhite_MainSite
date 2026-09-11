import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "../Logo";
import { Instagram, Phone, Mail, MapPin } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";
import { PrivacyPolicyModal } from "../PrivacyPolicyModal";
import { TermsConditionsModal } from "../TermsConditionsModal";

const INSTAGRAM_URL = "https://www.instagram.com/offwhitegoa?utm_source=qr";

const QUICK_LINKS = [
  { label: "About Us", to: "/about" as const },
  { label: "Menu", to: "/menu" as const },
  { label: "The Space", to: "/the-space" as const },
  { label: "Gallery", to: "/gallery" as const },
  { label: "Reservations", to: "/events" as const },
  { label: "Contact", to: "/contact" as const },
];

export function Footer() {
  const settings = useSiteSettings();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
    <footer className="bg-[#EFE3D1] pt-10 pb-5 lg:pt-16 lg:pb-6 safe-pb safe-pl safe-pr">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-6 md:gap-8 lg:gap-10">
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <div className="flex w-full items-center justify-between gap-3 lg:block">
            <Link to="/" className="shrink-0">
              <Logo light className="h-[4.5rem] w-auto lg:h-32" />
            </Link>
            <p className="min-w-0 flex-1 text-right text-[11px] leading-snug text-[var(--ink-muted)] sm:text-xs lg:mt-5 lg:flex-none lg:text-left lg:text-sm lg:leading-relaxed">
              Fine Dining · Crafted Cocktails
              <span className="lg:hidden"> · </span>
              <br className="hidden lg:block" />
              Global Soul
            </p>
            <a
              aria-label="Instagram @offwhitegoa"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-[var(--ink)] hover:text-[var(--cocoa)] lg:mt-5 lg:inline-flex"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[var(--ink)]">Quick Links</h4>
          <ul className="mt-3 lg:mt-5 space-y-2 lg:space-y-3 text-xs lg:text-sm text-[var(--ink-muted)]">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-[var(--cocoa)] transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[var(--ink)]">Opening Hours</h4>
          <div className="mt-3 lg:mt-5 space-y-2.5 lg:space-y-4 text-xs lg:text-sm text-[var(--ink-muted)]">
            <div>Monday – Thursday<br /><span className="text-[var(--ink)]">{settings.footer_hours_weekday}</span></div>
            <div>Friday – Sunday<br /><span className="text-[var(--ink)]">{settings.footer_hours_weekend}</span></div>
            <p className="text-[10px] lg:text-xs leading-snug">Kitchen closes 30 mins before closing time.</p>
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-x-5 md:col-span-1 md:block lg:col-span-1">
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[var(--ink)]">Contact</h4>
            <ul className="mt-3 lg:mt-5 space-y-2 lg:space-y-3 text-xs lg:text-sm text-[var(--ink-muted)]">
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-0.5 shrink-0" />
                <a href={`tel:${settings.phone_primary}`} className="hover:text-[var(--cocoa)] transition-colors">
                  {settings.phone_display}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-0.5 shrink-0" />
                <a href={`mailto:${settings.email_primary}`} className="hover:text-[var(--cocoa)] transition-colors break-all">
                  {settings.email_primary}
                </a>
              </li>
              <li className="hidden md:flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span className="leading-snug">
                  {settings.address_line1},<br />
                  {settings.address_line2},<br />
                  {settings.city}, {settings.state} – {settings.pincode}
                </span>
              </li>
            </ul>
          </div>

          <div className="md:hidden">
            <h4 className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[var(--ink)]">Address</h4>
            <p className="mt-3 flex items-start gap-2 text-xs text-[var(--ink-muted)] leading-snug">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span>
                {settings.address_line1}, {settings.address_line2}, {settings.city}, {settings.state} – {settings.pincode}
              </span>
            </p>
          </div>
        </div>

        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <div className="h-[100px] sm:h-[130px] lg:h-auto lg:aspect-[4/3] w-full overflow-hidden rounded-md border border-[var(--border)]">
            <iframe
              title="Map"
              src={settings.google_maps_embed_url}
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-10 mt-8 lg:mt-12 pt-4 lg:pt-6 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-2 lg:gap-3 text-[10px] lg:text-xs text-[var(--ink-muted)]">
        <p>© {settings.copyright_year} {settings.brand_name}. All rights reserved.</p>
        <div className="flex gap-5">
          <button
            type="button"
            onClick={() => setPrivacyOpen(true)}
            className="hover:text-[var(--cocoa)] transition-colors duration-300"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className="hover:text-[var(--cocoa)] transition-colors duration-300"
          >
            Terms &amp; Conditions
          </button>
        </div>
      </div>
    </footer>

    <PrivacyPolicyModal open={privacyOpen} onOpenChange={setPrivacyOpen} />
    <TermsConditionsModal open={termsOpen} onOpenChange={setTermsOpen} />
    </>
  );
}
