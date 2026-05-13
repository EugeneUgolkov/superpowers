export type Badge = 'new';

export type NavItem = {
  label: string;
  href: string;
  badge?: Badge;
};

export type NavFlyout = {
  type: 'flyout';
  label: string;
  href: string;
  items: NavItem[];
};

export type NavMega = {
  type: 'mega';
  label: string;
  href: string;
};

export type NavLink = {
  type: 'link';
  label: string;
  href: string;
  badge?: Badge;
};

export type PrimaryNavItem = NavLink | NavFlyout | NavMega;

export type NavCategory = {
  label: string;
  href: string;
  items: NavItem[];
};

export type LocationItem = {
  label: string;
  href: string;
};

export type NavConfig = {
  primary: PrimaryNavItem[];
  treatments: NavCategory[];
  utility: { login: string; book: string };
  locations: LocationItem[];
  footer: { about: string; faq: string; contact: string };
};
