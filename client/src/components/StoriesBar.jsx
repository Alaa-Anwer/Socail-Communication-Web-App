import { dummyStoriesData } from "../assets/assets";
import { Plus } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

const StoriesBar = () => {
  const { getToken } = useAuth();
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewedStory, setViewedStory] = useState(null);

  const fetchStories = async () => {
    try {
      const token = await getToken();

      const { data } = await api.get("/api/story/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setStories(data.stories);
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="w-full lg:max-w-2xl overflow-x-auto px-4 no-scrollbar">
      <div className="flex gap-4 pb-5">
        <div onClick={() => setShowModal(true)}
          className="rounded-lg shadow-sm min-w-30 max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300  bg-gradient-to-b from-indigo-50 to-white">
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center text-white">
              <Plus className="w-5 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-900 text-center mt-2">Create Story</p>
          </div>
        </div>
        {stories.map((story, index) => (
          <div
            onClick={() => setViewedStory(story)}
            key={index}
            className="relative rounded-lg shadow min-w-[120px] max-w-[120px] cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95"
          >
            <img src={story.user.profile_picture} alt="" className="absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow" />
            <p className="absolute top-18 left-3 text-white/60 text-sm truncate max-w-24">
              {story.content}
            </p>
            <p className = "text-white absolute bottom-1 right-2 z-10 text-xs">
          {moment(story.created_at).fromNow()}
            </p>
            {
              story.media_type !== "text" && (  
                <div className="absolute inset-0 z-10 rounded-lg bg-black overflow-hidden" >
                  {story.media_type === "image" ? 
                    <img src={story.media_url} alt="" className="w-full h-full object-cover hover:scale-105 transition duration-200 opacity-70 hover:opacity-80" /> :
                    <video src={story.media_url} className="w-full h-full object-cover hover:scale-105 transition duration-200 opacity-70 hover:opacity-80" autoPlay loop muted />
                   
                  }
                </div>
                
              )
            }
          </div>
        ))}
      </div>
      {showModal && <StoryModal  setShowModal={setShowModal} fetchStories={fetchStories} /> }
      {viewedStory && <StoryViewer viewedStory={viewedStory} setViewedStory={setViewedStory} /> }
    </div>

  )

};

export default StoriesBar;
