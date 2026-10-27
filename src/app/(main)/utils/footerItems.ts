export type FooterItem = {
  title: string
  items: { label: string, href: string }[]
}

export const footerItems: FooterItem[] = [
  {
    title: "About The Motherboard",
    items: [
      { label: "About Us", href: "#" },
      { label: "The Editorial Board", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Privacy Notice", href: "#" },
      { label: "URL Policy", href: "#" },
      { label: "User Policy", href: "#" }
    ]
  },
  {
    title: "News",
    items: [
      { label: "Institute News", href: "#" },
      { label: "College News", href: "#" },
      { label: "Student Buzz", href: "#" },
      { label: "CCS Innovations", href: "#" }
    ]
  },
  {
    title: "Editorial",
    items: [
      { label: "Latest Buzz", href: "#" },
      { label: "Campus Archives", href: "#" }
    ]
  },
  {
    title: "Sports",
    items: [
      { label: "Wolf Pack", href: "#" }
    ]
  },
  {
    title: "Feature",
    items: [
      { label: "Faculty Stories", href: "#" },
      { label: "Student Achievements", href: "#" }
    ]
  }
]