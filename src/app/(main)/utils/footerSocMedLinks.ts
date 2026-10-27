import { IconType } from "react-icons"
import { FaInstagram, FaFacebook } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { SiIssuu } from "react-icons/si"

export type FooterSocMedLink = {
  logo: IconType
  alt: string
  href: string
  hoverColor: string
}

export const footerSocMedLinks: FooterSocMedLink[] = [
  {
    logo: FaInstagram,
    alt: "Instagram",
    href: "https://www.instagram.com/ccsmotherboard",
    hoverColor: "hover:text-pink-500"
  },
  {
    logo: FaFacebook,
    alt: "Facebook", 
    href: "https://www.facebook.com/ccsmotherboard",
    hoverColor: "hover:text-blue-600"
  },
  {
    logo: FaXTwitter,
    alt: "Twitter",
    href: "https://x.com/ccsmotherboard",
    hoverColor: "hover:text-black"
  },
  {
    logo: SiIssuu,
    alt: "Issuu",
    href: "https://issuu.com/ccsmotherboard",
    hoverColor: "hover:text-red-500"
  }
]