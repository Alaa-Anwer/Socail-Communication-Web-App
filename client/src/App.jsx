import { Routes, Route, useLocation } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";

import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Message from "./pages/Message";
import ChatBox from "./pages/ChatBox";
import Discover from "./pages/Discover";
import CreatePost from "./pages/CreatePost";
import Connection from "./pages/Connection";
import Profile from "./pages/Profile";
import Layout from "./pages/Layout";

import { Toaster } from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { fetchUser } from "./features/user/userSlice";
import {fetchConnections} from "./features/connections/connectionSlice";
import { addMessage } from "./features/messages/messagesSlice";

export default function App() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);



  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(
        import.meta.env.VITE_BASEURL +
        "/api/message/" +
        user.id
      )

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === "connected") return

          if (
            pathnameRef.current ===
            "/messages/" + data.from_user_id
          ) {
            dispatch(addMessage(data))
          }
        } catch (error) {
          console.error("SSE parse error:", error)
        }
      }

      return () => {
        eventSource.close()
      }
    }
  }, [user , dispatch])

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken();

        dispatch(fetchUser(token));
        dispatch(fetchConnections(token));
      }
    };

    fetchData();
  }, [user, getToken, dispatch]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Toaster />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Feed />} />

          <Route path="messages" element={<Message />} />
          <Route path="message/:userId" element={<ChatBox />} />

          <Route path="discover" element={<Discover />} />

          <Route path="create-post" element={<CreatePost />} />

          <Route path="connections" element={<Connection />} />

          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}