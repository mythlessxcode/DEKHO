import { Clapperboard, HelpCircle, Home, Info } from 'lucide-react'
import * as React from 'react'

import { Brand } from '@/components/brand'
import { Footer, type FooterSection } from '@/components/footer'
import { Navbar, type NavLink } from '@/components/navbar'
import { Backdrop } from '@/components/backdrop'

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/', icon: <Home className="size-4" /> },
  { label: 'Movies', href: '/movies', icon: <Clapperboard className="size-4" /> },
  { label: 'About', href: '/#about', icon: <Info className="size-4" /> },
  { label: 'FAQ', href: '/#faq', icon: <HelpCircle className="size-4" /> },
]

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Browse',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Movies', href: '/movies' },
      { label: 'About', href: '/#about' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'FAQ', href: '/#faq' },
      { label: 'TMDb', href: 'https://www.themoviedb.org/', external: true },
    ],
  },
  {
    title: 'Social',
    wide: true,
    links: [
      { label: 'GitHub', href: 'https://github.com/mythlessxcode/DEKHO', external: true },
      { label: 'TMDb', href: 'https://www.themoviedb.org/', external: true },
    ],
  },
]

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Backdrop />
      <div className="sm:max-w-6xl lg:mx-auto">
        <Navbar logo={<Brand />} links={NAV_LINKS} />
        <main className="flex flex-col gap-y-4 p-6 sm:p-12">{children}</main>
        <Footer logo={<Brand />} tagline="Watch with intent." owner="DEKHO" sections={FOOTER_SECTIONS} />
      </div>
    </div>
  )
}
