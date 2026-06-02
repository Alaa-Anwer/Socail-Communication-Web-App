import { MapPin, MessageCircle, Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { fetchUser } from "@/features/user/userSlice";
import api from "@/api/axios";

const UserCard = ({ user }) => {
    const currentUser = useSelector((state) => state.user.value);
    const { getToken } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFollow = async () => {
        try {
            const token = await getToken();

            const { data } = await api.post(
                "/api/user/follow",
                { id: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                toast.success(data.message);

                dispatch(fetchUser(token));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const handleConnectionRequest = async () => {
        if (currentUser.connections.includes(user._id)) {
            return navigate(`/message/${user._id}`);
        }

        try {
            const token = await getToken();

            const { data } = await api.post(
                "/api/user/connect",
                { id: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                toast.success(data.message);

                dispatch(fetchUser(token));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };
    return (
        <div className="w-[280px] bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
            <div>
                <img
                    src={user.profile_picture}
                    alt={user.full_name}
                    className="w-20 h-20 rounded-full mx-auto object-cover"
                />

                <h3 className="mt-4 text-center font-semibold text-lg">
                    {user.full_name}
                </h3>

                {user.username && (
                    <p className="text-center text-gray-500">
                        @{user.username}
                    </p>
                )}

                {user.bio && (
                    <p className="text-sm text-center text-gray-600 mt-3 line-clamp-3">
                        {user.bio}
                    </p>
                )}

                <div className="flex justify-center gap-2 mt-4 text-xs">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100">
                        <MapPin className="w-3 h-3" />
                        {user.location || "Unknown"}
                    </div>

                    <div className="px-3 py-1 rounded-full bg-gray-100">
                        {user.followers?.length || 0} Followers
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mt-5">
                <button
                    onClick={handleFollow}
                    disabled={currentUser?.following?.includes(user._id)}
                    className="flex-1 py-2 rounded-lg flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition active:scale-95 cursor-pointer"
                >
                    <UserPlus className="w-4 h-4" />

                    {currentUser?.following?.includes(user._id)
                        ? "Following"
                        : "Follow"}
                </button>

                <button
                    onClick={handleConnectionRequest}
                    className="w-16 border border-gray-300 rounded-lg flex items-center justify-center text-slate-500 hover:bg-gray-50 active:scale-95 transition cursor-pointer"
                >
                    {currentUser?.connections?.includes(user._id) ? (
                        <MessageCircle onClick={() => navigate(`/message/${user._id}`)} className="w-5 h-5" />
                    ) : (
                        <Plus className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default UserCard;