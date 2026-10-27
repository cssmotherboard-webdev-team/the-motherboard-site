import React from "react"
import GenericNewsCard from "../components/Front Page components/genericNewsCard"
import ImageOnlyCard from "../components/Front Page components/imageOnlyCard"
import { sampleArticles } from "../utils/sampleArticles"

const LatestPhotos = () => {
  return (
    <div id="latestPhotos">
      <div className="flex items-center space-x-2 mb-2 pl-1">
        <span className="w-[5px] h-[57.2px] md:w-[3.5px] md:h-[40px] bg-black inline-block" />
        <p className="text-5xl md:text-4xl align-middle font-nubernext font-bold text-black hover:cursor-pointer">Latest Photos</p>
      </div>
      <div>
        <GenericNewsCard news={sampleArticles[20]} headlineSize="text-lg" />
      </div>
      <div className="grid grid-cols-2">
        {/* Render 4 articles from sampleArticles.ts */}
        {sampleArticles.slice(21, 25).map((article) => (
          <ImageOnlyCard key={article.id} news={article} />
        ))}
      </div>
    </div>
  )
}

export default LatestPhotos