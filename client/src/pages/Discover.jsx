import { useEffect, useState } from "react";
import { dummyConnectionsData } from "../assets/assets";
import { Search } from "lucide-react";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { fetchUser } from "@/features/user/userSlice";
import api from "@/api/axios";

const Discover = () => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      try {
        setUsers([]);
        setLoading(true);

        const token = await getToken();

        const { data } = await api.post(
          "/api/user/discover",
          { input },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setUsers(data.users);
          setInput("");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = await getToken();
      dispatch(fetchUser(token));
    };

    loadUser();
  }, [dispatch, getToken]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl p-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Discover People
          </h1>

          <p className="text-slate-600">
            Connect with amazing people and grow your network
          </p>
        </div>

        <div className="mb-8 mt-6 shadow-md rounded-md border border-slate-200/60 bg-white/80">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

              <input
                type="text"
                placeholder="Search people by name, username, bio, or location..."
                className="w-full pl-10 sm:pl-12 py-2 border border-gray-300 rounded-md max-sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
            <div className="flex flex-wrap gap-6">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                />
              ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Discover;