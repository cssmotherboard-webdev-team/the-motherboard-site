import React from "react"
import Image from "next/image"
import { Article } from "../../utils/sampleArticles"

interface TopNewsCardProps {
  news: Article
}

/**
 * Calculate relative time from a given date to now
 * 
 * Converts a timestamp into human-readable relative time format.
 * Examples: "5 minutes ago", "2 hours ago", "3 days ago"
 * 
 * @param date - The date to calculate time difference from
 * @returns Human-readable time difference string
 */
const getTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`
  
  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`
}

const TopNewsCard = ({ news }: TopNewsCardProps) => {
  return (
    <div className="w-full z-100 bg-white p-4 rounded-lg hover:scale-105 hover:shadow-[0_0_8px_2px_rgba(0,0,0,0.2)] hover:rounded-lg hover:cursor-pointer transition duration-500 ease-in-out">
      <a href="#">
        <div id="main-news-headline">
          <p className="text-4xl font-semibold leading-9">{news.headline}</p>
        </div>
        <div id="main-news-release-time">
          <p className="text-lg text-black/50">{getTimeAgo(news.releaseTime)}</p>
        </div>
        <div id="main-news-image">
          <Image src={news.image} alt={news.headline} className="mt-5 w-full" width={500} height={500} />
        </div>
        <div id="main-news-text">
          <p className="text-[16px] mt-[17px]">{news.description}</p>
        </div>
      </a>
    </div>
  )
}

export default TopNewsCard