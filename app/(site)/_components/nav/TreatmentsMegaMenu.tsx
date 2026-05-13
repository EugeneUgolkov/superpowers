'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { NewBadge } from './NewBadge';
import { navConfig } from './nav.config';

const OPEN_DELAY_MS = 150;
const CLOSE_DELAY_MS = 200;

type TreatmentsMegaMenuProps = {
  label: string;
  href: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export function TreatmentsMegaMenu({
  label,
  href,
  isOpen,
  onOpen,
  onClose,
}: TreatmentsMegaMenuProps) {
  const pathname = usePathname();
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  const isTriggerActive = pathname === href;

  const clearTimers = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleOpen = () => {
    clearTimers();
    openTimer.current = setTimeout(onOpen, OPEN_DELAY_MS);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = setTimeout(onClose, CLOSE_DELAY_MS);
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const focusItemByOffset = (offset: number) => {
    const items = panelRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]');
    if (!items || items.length === 0) return;
    const active = document.activeElement as HTMLElement | null;
    const currentIndex = active ? Array.from(items).indexOf(active as HTMLAnchorElement) : -1;
    const nextIndex = (currentIndex + offset + items.length) % items.length;
    items[nextIndex]?.focus();
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      onOpen();
      requestAnimationFrame(() => focusItemByOffset(1));
    } else if (event.key === ' ') {
      event.preventDefault();
      if (isOpen) onClose();
      else onOpen();
    }
  };

  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusItemByOffset(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusItemByOffset(-1);
    }
  };

  const onFocusOut = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    onClose();
  };

  return (
    <div
      className="static"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={() => {
        clearTimers();
        onOpen();
      }}
      onBlur={onFocusOut}
    >
      <Link
        ref={triggerRef}
        href={href}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onKeyDown={onTriggerKeyDown}
        className={`relative inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded ${
          isTriggerActive
            ? 'after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-orange-500'
            : ''
        }`}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Link>

      {isOpen && (
        <div
          ref={panelRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onPanelKeyDown}
          className="absolute left-0 right-0 top-full mt-2 border-y border-white/10 bg-slate-900 shadow-2xl"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-3">
            {navConfig.treatments.map((category) => (
              <div key={category.href}>
                <Link
                  href={category.href}
                  role="menuitem"
                  className="block text-base font-semibold text-white hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
                >
                  {category.label}
                </Link>
                <ul className="mt-3 space-y-1">
                  {category.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          role="menuitem"
                          className={`flex items-center rounded px-2 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                            isActive
                              ? 'border-l-2 border-orange-500 pl-[6px] font-semibold text-white'
                              : ''
                          }`}
                        >
                          {item.label}
                          {item.badge === 'new' && <NewBadge />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
