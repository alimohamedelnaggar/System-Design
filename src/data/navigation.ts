import type { FooterNavGroup, NavItem } from '../types/navigation'

export const primaryNavItems: NavItem[] = [
  { label: 'Roadmap', to: '/roadmap' },
  { label: 'Course', to: '/course' },
  { label: 'Projects', to: '/projects' },
  { label: 'Interviews', to: '/interviews' },
  { label: 'Playground', to: '/playground' },
  { label: 'Simulations', to: '/simulations' },
  { label: 'Progress', to: '/progress' },
]

export const footerNavGroups: FooterNavGroup[] = [
  {
    label: 'Learn',
    items: [
      { label: 'Learning roadmap', to: '/roadmap' },
      { label: 'Course overview', to: '/course' },
      { label: 'Practice projects', to: '/projects' },
      { label: 'Interactive simulations', to: '/simulations' },
    ],
  },
  {
    label: 'Prepare',
    items: [
      { label: 'Interview prep', to: '/interviews' },
      { label: 'Playground', to: '/playground' },
      { label: 'Your progress', to: '/progress' },
    ],
  },
]

export const homeNavItem: NavItem = { label: 'Home', to: '/' }

export function isNavItemActive(pathname: string, to: string): boolean {
  if (to === '/roadmap') {
    return pathname === '/roadmap' || pathname.startsWith('/domain/')
  }

  if (to === '/course') {
    return pathname === '/course' || pathname.startsWith('/lesson/')
  }

  if (to === '/simulations') {
    return pathname === '/simulations' || pathname.startsWith('/simulations/')
  }

  return pathname === to
}
