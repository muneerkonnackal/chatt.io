// import { cn } from "@/lib/utils"
// import { useEffect, useRef } from "react"

// const VideoContainer = ({stream, isLocalStream, isOnCall}) => {
//     const videoRef = useRef(null)
//     useEffect(()=>{
//         if(videoRef.current && stream){
//             videoRef.current.srcObject = stream
//         }
//     },[stream])
 
//     return (
//     <video className={cn("rounded border w-[800px]", isLocalStream && isOnCall && "w-[200px] h-auto absolute border-purple-500 border-2" )} ref={videoRef} autoPlay playsInline muted={isLocalStream}  style={{
//                     transform: isLocalStream ? "scaleX(-1)" : "none",
//           }} />
//   )
// }

// export default VideoContainer

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const VideoContainer = ({ stream, isLocalStream, isOnCall, userName, profileImage }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="">
      {/* Video Element */}
      <video
        className={cn(
          "rounded border w-[1000px]",
          isLocalStream && isOnCall && "xl:w-[250px] w-[150px] h-auto absolute border-purple-500 border-2"
        )}
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocalStream}
        style={{ transform: isLocalStream ? "scaleX(-1)" : "none" }}
      />

      {/* Name & Profile Image Overlay */}
      <div
        className={cn(
          "absolute flex items-center mt-16  space-x-2 bg-black bg-opacity-40 px-2 py-1 rounded-md text-white",
          isLocalStream ? "top-2 left-2" : "bottom-2 right-2"
        )}
      >
        <img src={profileImage} alt={userName} className="xl:w-8 xl:h-8 w-5 h-5  rounded-full border border-white" />
        <span className="text-sm font-semibold">{isLocalStream ? "You" : userName}</span>
      </div>
    </div>
  );
};

export default VideoContainer;
