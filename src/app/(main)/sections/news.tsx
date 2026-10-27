import React from "react"
import TopNewsCard from "../components/Front Page components/topNewsCard"
import GenericNewsCard from "../components/Front Page components/genericNewsCard"
import HeadlineOnlyCard from "../components/Front Page components/headlineOnlyCard"
import { sampleArticles } from "../utils/sampleArticles"

const News = () => {
  return (
    <div id="news" className="w-full">
      <div className="flex items-center space-x-2 mb-2 pl-1">
        <span className="w-[5px] h-[57.2px] md:w-[3.5px] md:h-[40px] bg-custom-blue inline-block" />
        <p className="text-5xl md:text-4xl align-middle font-nubernext font-bold text-black hover:text-custom-blue hover:cursor-pointer transition duration-700 ease-in-out">Top News</p>
      </div>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="main-news-container flex flex-col md:flex-row items-center justify-between w-full md:w-[72.5%]">
          <div className="w-full h-auto md:w-[61%] top-news-card-container">
            <TopNewsCard news={sampleArticles[0]} />
          </div>
          <div className="w-full h-auto md:w-[39%] gap-y-4 md:gap-y-0 side-news-card-container">
            {sampleArticles.slice(1, 3).map((article) => (
              <GenericNewsCard key={article.id} news={article} />
            ))}
          </div>
        </div>
        <div className="more-stories-card-container w-full md:w-[27.5%]">
          <p className="text-4xl  md:text-3xl p-4 pb-0 font-nubernext text-custom-blue font-semibold">More Stories</p>
          {sampleArticles.slice(3, 8).map((article) => (
            <React.Fragment key={article.id}>
              <HeadlineOnlyCard news={article}/>
              <hr className="border border-black mx-4" />
            </React.Fragment>
          ))}
          <div className="px-4 mt-4 md:mt-2">
            <a href="#" className="text-custom-blue text-lg md:text-xs leading-[22px]">SEE MORE ARTICLES</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default News