import React from "react"
import Image from "next/image"
import { footerItems } from "../utils/footerItems"
import { footerSocMedLinks } from "../utils/footerSocMedLinks"

const Footer = () => {
  return (
    <footer className="bg-custom-grey pt-[40px] pb-[30px]">
      <div className="mx-8 md:ml-[70px] md:mr-12 flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0 md:space-x-4">
        
        {/* Footer Logo Section */}
        <div id="footer-logo" className="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 md:space-y-4">
          <Image 
            src="/images/tmb_logo.png" 
            alt="The Motherboard Logo" 
            width={110} 
            height={110}
            className="md:w-auto md:h-auto w-[90px] h-[90px]"
          />
          <Image 
            src="/images/Motherboard Text Logo.png" 
            alt="The Motherboard wordmark"
            width={275}
            height={62}
            className="md:w-full md:full w-[200px] h-[45px]"
          />
        </div>

        {/* About Section */}
        <div id="footer-about" className="w-[200px]">
          <ul id="footer-about-list" className="space-y-0">
            <li className="font-bold">{footerItems[0].title}</li>
            {footerItems[0].items.map((item, index) => (
              <li key={index} className="text-[13px]">
                <a href={item.href} className="hover:underline">{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories Section */}
        <div id="footer-categories" className="grid grid-cols-2 gap-8">
          {footerItems.slice(1).map((category, index) => (
            <div key={index} id={`footer-${category.title.toLowerCase()}-category`} className="w-[125px]">
              <ul className="space-y-0">
                <li className="font-bold">{category.title}</li>
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-[13px]">
                    <a href={item.href} className="hover:underline">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media Section */}
        <div className="relative flex flex-col items-center space-y-2 md:ml-4">
          <p className="text-[13px] md:ml-[-75px] md:mt-[100px]">FOLLOW THE MOTHERBOARD</p>
          <div className="flex space-x-8 md:ml-[-75px]">
            {footerSocMedLinks.map((link, index) => {
              // Get the icon component from the link.logo
              const IconComponent = link.logo
              return (
                <a key={index} href={link.href} target="_blank" rel="noopener noreferrer">
                  <IconComponent 
                    className={`h-6 w-6 text-black ${link.hoverColor} transition-colors duration-200`}
                    aria-label={link.alt}
                  />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer