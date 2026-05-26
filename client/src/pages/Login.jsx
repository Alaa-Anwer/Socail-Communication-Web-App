import { assets } from "../assets/assets";
import { Star } from "lucide-react";
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col md:flex-row">
      {" "}
      <img
        src={assets.bgImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <div className="flex-1 flex flex-col items-start justify-between lg:pl-40 p-6 md:p-10">
        <img src={assets.logo} alt="" className="h-12 object-contain" />

        <div>
          <div className="flex items-center gap-3 mb-4 max-md:mt-10">
            <img src={assets.group_users} alt="" className="h-8 md:h-10" />
            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <Star
                      key={index}
                      className="size-4 md:size-4.5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>
              <p>Used by over 5K+ users worldwide</p>
            </div>
          </div>
          <h1
            className="text-3xl md:text-6xl md:pb-2
        bg-linear-to-r from-indigo-950 to-indigo-800 bg-clip-text 
         text-transparent font-bold"
          >
            More Than Just a Social Media Platform
          </h1>
          <p className="flex-1 flex items-center justify-center p-6 sm:p-10">
         
          </p>
        </div>
        <span className=""></span>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <SignIn />
      </div>
    </div>
  );
};

export default Login;
