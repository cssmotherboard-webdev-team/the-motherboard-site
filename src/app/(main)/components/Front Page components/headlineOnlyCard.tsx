import React from "react"
import { Article } from "../../utils/sampleArticles"

interface HeadlineOnlyCardProps {
  news: Article
  font?: string   // Optional prop to control font weight, default to semibold
}

const HeadlineOnlyCard = ({ news, font = "font-semibold" }: HeadlineOnlyCardProps) => {
  return (
    <div className="w-auto h-auto bg-white p-2 pt-3 mx-2 rounded-lg hover:scale-105 hover:shadow-[0_0_8px_2px_rgba(0,0,0,0.2)] hover:rounded-lg hover:cursor-pointer transition duration-500 ease-in-out">
      <a href="#">
        <div>
          <p className={`text-lg md:text-[16px] ${font} leading-[22px]`}>{news.headline}</p>
        </div>
      </a>
    </div>
  )
}

export default HeadlineOnlyCard