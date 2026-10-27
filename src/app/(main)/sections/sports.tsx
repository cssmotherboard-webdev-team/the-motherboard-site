import React from "react"
import GenericNewsCard from "../components/Front Page components/genericNewsCard"
import HeadlineOnlyCard from "../components/Front Page components/headlineOnlyCard"
import { sampleArticles } from "../utils/sampleArticles"

const Sports = () => {
  return (
    <div id="sports">
      <div className="flex items-center space-x-2 mb-2 pl-1">
        <span className="w-[5px] h-[57.2px] md:w-[3.5px] md:h-[40px] bg-custom-dark-red inline-block" />
        <p className="text-5xl md:text-4xl  align-middle font-nubernext font-bold text-black hover:text-custom-dark-red hover:cursor-pointer transition duration-700 ease-in-out">Sports</p>
      </div>
      <div>
        {/* Render 1 article from sampleArticles.ts */}
        <GenericNewsCard news={sampleArticles[12]} headlineSize="text-lg" />
      </div>
      <div>
        {/* Render 3 articles from sampleArticles.ts */}
        {sampleArticles.slice(13, 16).map((article)=> (
          <React.Fragment key={article.id}>
            <hr className="border border-black mx-4" />
            <HeadlineOnlyCard news={article} font={"font-light"} />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default Sports