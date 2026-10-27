import React from "react"
import Image from "next/image"
import { Article } from "../../utils/sampleArticles"

interface ImageOnlyCardProps {
  news: Article,
}

const ImageOnlyCard = ({ news }: ImageOnlyCardProps) => {
  return (
    <div className="w-full h-full bg-white p-2 rounded-lg hover:scale-105 hover:shadow-[0_0_8px_2px_rgba(0,0,0,0.2)] hover:rounded-lg hover:cursor-pointer transition duration-500 ease-in-out">
      <a href="#">
        <Image src={news.image} alt={news.headline} className="w-full" width={500} height={500} />
      </a>
    </div>
  )
}

export default ImageOnlyCard