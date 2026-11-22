export interface NavItem {
  label: string
  to: string
}

export interface FooterNavGroup {
  label: string
  items: NavItem[]
}
