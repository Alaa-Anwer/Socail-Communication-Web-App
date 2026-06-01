import {
  Users,
  UserPlus,
  UserCheck,
  UserRoundPen,
  MessageSquare,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections,
} from "../assets/assets";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/api/axios";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConnections } from "@/features/connections/connectionSlice";

const Connections = () => {
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("Followers");
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const {
    connections,
    pendingConnections,
    followers,
    following,
  } = useSelector((state) => state.connections);

  const dataArray = [
    {
      label: "Followers",
      value: followers,
      icon: Users,
    },
    {
      label: "Following",
      value: following,
      icon: UserCheck,
    },
    {
      label: "Connections",
      value: connections,
      icon: UserRoundPen,
    },
    {
      label: "Pending",
      value: pendingConnections,
      icon: UserPlus,
    },
  ];





  const handleUnfollow = async (userId) => {
    try {
      const { data } = await api.post(
        "/api/user/unfollow",
        { id: userId },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const acceptConnections = async (userId) => {
    try {
      const token = await getToken();

      const { data } = await api.post(
        "/api/user/accept",
        { id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);

        // تحديث البيانات بعد قبول الطلب
        dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const loadConnections = async () => {
      const token = await getToken();
      dispatch(fetchConnections(token));
    };

    loadConnections();
  }, [dispatch, getToken]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl p-6">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Connections
          </h1>

          <p className="text-slate-600">
            Manage your network and discover new connections
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-6">
          {dataArray.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md"
            >
              <b>{item.value.length}</b>

              <p className="text-slate-600">
                {item.label}
              </p>
            </div>
          ))}
        </div>
        <div className="inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm">
          {dataArray.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setCurrentTab(tab.label)}
              className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${currentTab === tab.label
                  ? "bg-white font-medium text-black"
                  : "text-gray-500 hover:text-black"
                }`}
            >
              <tab.icon className="w-4 h-4" />

              <span className="ml-1">
                {tab.label}
              </span>

              {tab.count !== undefined && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-6 mt-6">
          {dataArray
            .find((item) => item.label === currentTab)
            .value.map((user) => (
              <div
                key={user._id}
                className="w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md"
              >
                <img
                  src={user.profile_picture}
                  className="rounded-full w-12 h-12 shadow-md mx-auto"
                />

                <div className="flex-1">
                  <p className="font-medium text-slate-700">
                    {user.full_name}
                  </p>

                  <p className="text-slate-600">
                    @{user.username}
                  </p>

                  <p className="text-sm text-gray-600">
                    {user.bio.slice(0, 30)}...
                  </p>

                  <div className="flex max-sm:flex-col gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/profile/${user._id}`)}
                      className="w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer"
                    >
                      View Profile
                    </button>
                    {
                      currentTab === "Following" && (
                        <button
                          onClick={() => handleUnfollow(user._id)}
                          className="w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer"
                        >
                          Unfollow
                        </button>
                      )
                    }

                    {
                      currentTab === "Pending" && (
                        <button
                          onClick={() => acceptConnections(user._id)}
                          className="w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer"
                        >
                          Accept
                        </button>
                      )
                    }

                    {
                      currentTab === "Connections" && (
                        <button
                          onClick={() => navigate(`/message/${user._id}`)}
                          className="w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200 text-black active:scale-95 transition cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4 inline-block mr-1" />
                          Message
                        </button>
                      )
                    }
                  </div>
                </div>
              </div>
            ))}
        </div>


        
      </div>

    </div>
  );
};

export default Connections;