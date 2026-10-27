import News from "./sections/news"
import EditorsPicks from "./sections/editorsPicks"
import Sports from "./sections/sports"
import Feature from "./sections/feature"
import LatestPhotos from "./sections/latestPhotos"

export default function Home() {
  return (
    <div className="flex flex-col font-monasans px-6 gap-y-9">
      <News />
      <EditorsPicks />
      {/* Three Column Layout */}
      <div className="flex flex-col md:flex-row w-full items-start mb-24 gap-y-4 md:gap-y-0">
        <div className="w-full md:w-1/3">
          <Sports />
        </div>
        <div className="w-full md:w-1/3">
          <Feature />
        </div>
        <div className="w-full md:w-1/3">
          <LatestPhotos />
        </div>
      </div>
    </div>
  );
}