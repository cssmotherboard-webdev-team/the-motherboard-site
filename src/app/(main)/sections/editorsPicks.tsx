import React from "react"
import GenericNewsCard from "../components/Front Page components/genericNewsCard"
import { sampleArticles } from "../utils/sampleArticles"

const EditorsPicks = () => {
  return (
    <div id="editors-picks">
      <div className="flex items-center space-x-2 mb-2 pl-1">
        <span className="w-[5px] h-[57.2px] md:w-[3.5px] md:h-[40px] bg-custom-yellow inline-block" />
        <p className="text-5xl md:text-4xl align-middle font-nubernext font-bold text-black hover:text-custom-yellow hover:cursor-pointer transition duration-700 ease-in-out">
          {"Editor's Picks"}
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between space-x-2">
        {/* Render 4 articles from sampleArticles.ts */}
        {sampleArticles.slice(8, 12).map((article) => (
          <GenericNewsCard key={article.id} news={article} headlineSize="text-[16px]" />
        ))}
      </div>
    </div>
  )
}

export default EditorsPicks