'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NewBadge } from './NewBadge';
import { navConfig } from './nav.config';

const SCROLL_THRESHOLD_PX = 80;

export function MobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openTreatmentCategory, setOpenTreatmentCategory] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const savedScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    savedScrollY.current = window.scrollY;
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${savedScrollY.current}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      window.scrollTo(0, savedScrollY.current);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleSection = (label: string) =>
    setOpenSection((current) => (current === label ? null : label));
  const toggleTreatmentCategory = (label: string) =>
    setOpenTreatmentCategory((current) => (current === label ? null : label));

  const linkClass = (href: string) =>
    `block py-2 text-base text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded ${
      pathname === href ? 'border-l-2 border-orange-500 pl-3 font-semibold text-white' : ''
    }`;

  return (
    <div
      className={`lg:hidden bg-slate-900 transition-shadow ${
        scrolled ? 'border-b border-white/10' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
        >
          Humanaut Health
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={navConfig.utility.book}
            className="inline-flex items-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Book
          </Link>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu-overlay"
            className="inline-flex h-10 w-10 items-center justify-center rounded text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          ref={overlayRef}
          id="mobile-menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <Link
              href="/"
              className="text-base font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
            >
              Humanaut Health
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                requestAnimationFrame(() => triggerRef.current?.focus());
              }}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Mobile primary"
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
          >
            <Link href="/how-it-works" className={linkClass('/how-it-works')}>
              How It Works
            </Link>

            {navConfig.primary
              .filter((item) => item.type === 'flyout')
              .map((section) => {
                if (section.type !== 'flyout') return null;
                const open = openSection === section.label;
                return (
                  <div key={section.label} className="border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.label)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between py-3 text-base font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
                    >
                      <span>{section.label}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {open && (
                      <div className="pb-2 pl-3">
                        <Link href={section.href} className={linkClass(section.href)}>
                          All {section.label}
                        </Link>
                        {section.items.map((item) => (
                          <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

            <div className="border-t border-white/5">
              <button
                type="button"
                onClick={() => toggleSection('Treatments')}
                aria-expanded={openSection === 'Treatments'}
                className="flex w-full items-center justify-between py-3 text-base font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
              >
                <span>Treatments</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`h-5 w-5 transition-transform ${
                    openSection === 'Treatments' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'Treatments' && (
                <div className="pb-2 pl-3">
                  {navConfig.treatments.map((category) => {
                    const open = openTreatmentCategory === category.label;
                    return (
                      <div key={category.href} className="border-t border-white/5 first:border-t-0">
                        <button
                          type="button"
                          onClick={() => toggleTreatmentCategory(category.label)}
                          aria-expanded={open}
                          className="flex w-full items-center justify-between py-2 text-sm font-semibold text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
                        >
                          <span>{category.label}</span>
                          <ChevronDown
                            aria-hidden="true"
                            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {open && (
                          <div className="pb-2 pl-3">
                            <Link href={category.href} className={linkClass(category.href)}>
                              All {category.label}
                            </Link>
                            {category.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`${linkClass(item.href)} flex items-center`}
                              >
                                {item.label}
                                {item.badge === 'new' && <NewBadge />}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-white/5">
              <Link
                href="/treatments/regenerative/stem-cells"
                className={`${linkClass('/treatments/regenerative/stem-cells')} flex items-center`}
              >
                Stem Cells
                <NewBadge />
              </Link>
            </div>

            <div className="my-4 border-t border-white/10" role="separator" />

            <div className="space-y-1">
              <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wider text-white/50">
                Locations
              </p>
              {navConfig.locations.map((loc) => (
                <Link key={loc.href} href={loc.href} className={linkClass(loc.href)}>
                  {loc.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 space-y-1">
              <Link href={navConfig.footer.about} className={linkClass(navConfig.footer.about)}>
                About
              </Link>
              <Link href={navConfig.footer.faq} className={linkClass(navConfig.footer.faq)}>
                FAQ
              </Link>
              <Link href={navConfig.footer.contact} className={linkClass(navConfig.footer.contact)}>
                Contact
              </Link>
            </div>
          </nav>

          <div
            className="border-t border-white/10 px-4 py-4"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <div className="flex items-center justify-between gap-4">
              <Link
                href={navConfig.utility.login}
                className="text-base font-medium text-white/85 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
              >
                Login
              </Link>
              <Link
                href={navConfig.utility.book}
                className="inline-flex items-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
