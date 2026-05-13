import type { NavConfig } from './types';

export const navConfig: NavConfig = {
  primary: [
    {
      type: 'link',
      label: 'How It Works',
      href: '/how-it-works',
    },
    {
      type: 'flyout',
      label: 'Memberships',
      href: '/memberships',
      items: [
        { label: 'Path Membership', href: '/memberships/path' },
        { label: 'Bond Membership', href: '/memberships/bond' },
      ],
    },
    {
      type: 'flyout',
      label: 'Testing',
      href: '/testing',
      items: [
        { label: 'Advanced Health Check', href: '/testing/advanced-health-check' },
        { label: 'Executive Physical', href: '/testing/executive-physical' },
        { label: 'DEXA', href: '/testing/dexa' },
        { label: 'CIMT', href: '/testing/cimt' },
        { label: 'VO2 Max', href: '/testing/vo2-max' },
      ],
    },
    {
      type: 'mega',
      label: 'Treatments',
      href: '/treatments',
    },
    {
      type: 'link',
      label: 'Stem Cells',
      href: '/treatments/regenerative/stem-cells',
      badge: 'new',
    },
  ],
  treatments: [
    {
      label: 'Regenerative',
      href: '/treatments/regenerative',
      items: [
        {
          label: 'Stem Cell Therapy',
          href: '/treatments/regenerative/stem-cells',
          badge: 'new',
        },
        { label: 'Complete Blood Cleanse', href: '/treatments/regenerative/blood-cleanse' },
        { label: 'EBO2', href: '/treatments/regenerative/ebo2' },
        { label: 'TPE', href: '/treatments/regenerative/tpe' },
      ],
    },
    {
      label: 'Hormone Optimization',
      href: '/treatments/hormone',
      items: [
        { label: 'For Men (TRT)', href: '/treatments/hormone/men' },
        { label: 'For Women (HRT)', href: '/treatments/hormone/women' },
        { label: 'Peptide Therapy', href: '/treatments/hormone/peptides' },
        { label: 'Medical Weight Loss', href: '/treatments/hormone/weight-loss' },
      ],
    },
    {
      label: 'Recovery & Performance',
      href: '/treatments/recovery',
      items: [
        { label: 'IV + IM Therapy', href: '/treatments/recovery/iv-im' },
        { label: 'Shockwave', href: '/treatments/recovery/shockwave' },
        { label: 'PEMF Therapy', href: '/treatments/recovery/pemf' },
        { label: 'Shiftwave', href: '/treatments/recovery/shiftwave' },
        { label: 'ChillyBox', href: '/treatments/recovery/chillybox' },
        { label: 'HBOT', href: '/treatments/recovery/hbot' },
      ],
    },
  ],
  utility: {
    login: '/login',
    book: '/book',
  },
  locations: [
    { label: 'Austin, TX', href: '/locations/austin' },
    { label: 'Dallas, TX', href: '/locations/dallas' },
    { label: 'Palm Beach Gardens, FL', href: '/locations/palm-beach-gardens' },
  ],
  footer: {
    about: '/about',
    faq: '/faq',
    contact: '/contact',
  },
};
