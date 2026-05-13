import { MobileMenu } from './MobileMenu';
import { NavBar } from './NavBar';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Skip to content
      </a>
      <NavBar />
      <MobileMenu />
    </header>
  );
}
