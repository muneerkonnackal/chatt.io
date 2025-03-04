
// import { cn } from "@/lib/utils";
// import { useEffect, useRef } from "react";

// const VideoContainer = ({ stream, isLocalStream, isOnCall, userName, profileImage,
//   isScreenSharing }) => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const videoElement = videoRef.current;
//     if (!videoElement || !stream) return;

//     // Create fresh MediaStream to force video update
//     const updateVideo = () => {
//       videoElement.srcObject = new MediaStream(stream.getTracks());
//     };

//     // Initial setup
//     updateVideo();

//     // Listen for track changes
//     stream.addEventListener("addtrack", updateVideo);
//     stream.addEventListener("removetrack", updateVideo);

//     return () => {
//       stream.removeEventListener("addtrack", updateVideo);
//       stream.removeEventListener("removetrack", updateVideo);
//       videoElement.srcObject = null;
//     };
//   }, [stream]);

//   return (
//     <div className="">
//       <video
//   className={cn(
//     "rounded border w-[800px]",
//     isLocalStream && isOnCall && "xl:w-[300px] w-[250px] h-auto absolute border-purple-500 border-2"
//   )}
//   ref={videoRef}
//   autoPlay
//   playsInline
//   muted={isLocalStream}
//   style={{ 
//     transform: isLocalStream && !isScreenSharing ? "scaleX(-1)" : "none",
//     objectFit: isScreenSharing ? 'contain' : 'cover'
//   }}
// />

//    <div
//   className={cn(
//     "absolute flex items-center  mt-16 space-x-2 bg-black bg-opacity-40 px-2 py-1 rounded-md text-white",
//     isLocalStream ? "top-2 left-2" : "bottom-2 right-2"
//   )}
// >
//   {profileImage && (
//     <img
//       src={profileImage}
//       alt={userName}
//       className="xl:w-8 xl:h-8 w-5 h-5 rounded-full border border-white"
//     />
//   )}
//   <span className="text-sm font-semibold">
//     {userName}
//   </span>
// </div>

//     </div>
//   );
// };

// export default VideoContainer;

"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const VideoContainer = ({ 
  stream, 
  isLocalStream, 
  userName, 
  profileImage,
  isScreenSharing,
  isScreen
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !stream) return;

    const updateVideo = () => {
      videoElement.srcObject = new MediaStream(stream.getTracks());
    };

    updateVideo();

    stream.addEventListener("addtrack", updateVideo);
    stream.addEventListener("removetrack", updateVideo);

    return () => {
      stream.removeEventListener("addtrack", updateVideo);
      stream.removeEventListener("removetrack", updateVideo);
      videoElement.srcObject = null;
    };
  }, [stream]);

  return (
    <div className="relative">
      <video
        className={cn(
          "rounded border w-full",
          isLocalStream && "xl:w-[300px] w-[250px] h-auto absolute top-2 left-2 border-purple-500 border-2",
          isScreen && "border-2 border-green-500"
        )}
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocalStream}
        style={{ 
          transform: isLocalStream && !isScreenSharing ? "scaleX(-1)" : "none",
          objectFit: isScreen ? 'contain' : 'cover'
        }}
      />

      <div className={cn(
        "absolute flex items-center mt-16 space-x-2 bg-black bg-opacity-40 px-2 py-1 rounded-md text-white",
        isLocalStream ? "top-2 left-2" : "bottom-2 right-2"
      )}>
        {profileImage && (
          <img
            src={profileImage}
            alt={userName}
            className="xl:w-8 xl:h-8 w-5 h-5 rounded-full border border-white"
          />
        )}
        <span className="text-sm font-semibold">
          {userName}
        </span>
      </div>
    </div>
  );
};

export default VideoContainer;