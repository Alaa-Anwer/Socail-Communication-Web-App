import { useEffect, useState } from "react";
import { assets, dummyPostsData } from "../assets/assets";
import Loading from "@/components/Loading";
import StoriesBar from "@/components/StoriesBar";
import PostCard from "@/components/PostCard";
import RecentMessages from "@/components/RecentMessages";
import { useAuth } from "@clerk/clerk-react";
import api from "@/api/axios";
import toast from "react-hot-toast";

const Feed = () => {
const { getToken } = useAuth();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchFeeds = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/api/post/feed", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setFeeds(data.posts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFeeds();
  }, []);
  return !loading ? (
    <>
      <div className="h-full overflow-y-auto py-10 xl:pr-5 flex gap-8">

        <div className="flex-1 max-w-2xl">
          <StoriesBar />

          <div className="p-4 space-y-6">
            {feeds.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>

        <div className="max-xl:hidden sticky top-0">
          <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
            <h1 className="text-slate-800 font-semibold">
              Sponsored
            </h1>

            <img
              src={assets.sponsored_img}
              className="w-75 h-50 rounded-md"
            />

            <p className="text-slate-600">
              Email marketing
            </p>

            <p className="text-slate-400">
              Supercharge your marketing with a powerful, easy-to-use platform
              built for results.
            </p>
          </div>

          <RecentMessages />
        </div>

      </div>
    </>
  ) : (
    <Loading />
  );
}  

export default Feed