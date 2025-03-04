"use client";

import { useSocket } from "@/context/SocketContext";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
  MdScreenShare,
  MdStopScreenShare,
} from "react-icons/md";
import { ImPhoneHangUp } from "react-icons/im";
import { useUser } from "@clerk/nextjs";

const VideoCall = () => {
  const {
    localStream,
    screenStream,
    remoteStreams,
    isScreenSharing,
    ongoingCall,
    isCallEnded,
    handleHangup,
    toggleScreenShare,
  } = useSocket();
  const { user } = useUser();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVidOn, setIsVidOn] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const localCameraRef = useRef(null);
  const localScreenRef = useRef(null);
  const remoteVideoRefs = useRef([]);

  // Determine remote participant
  const isCaller = user?.id === ongoingCall?.participants?.caller?.userId;
  const remoteParticipant = isCaller
    ? ongoingCall?.participants?.receiver
    : ongoingCall?.participants?.caller;
  const remoteName = remoteParticipant?.profile?.fullName?.split(" ")[0] || "Participant";

  // Format time for display
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0
      ? `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Update mic and video states when localStream changes
  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      const videoTrack = localStream.getVideoTracks()[0];
      if (audioTrack) setIsMicOn(audioTrack.enabled);
      if (videoTrack) setIsVidOn(videoTrack.enabled);
    }
  }, [localStream]);

  // Set start time when remote streams are available
  useEffect(() => {
    if (remoteStreams.length > 0 && !startTime) {
      setStartTime(Date.now());
    }
  }, [remoteStreams, startTime]);

  // Update elapsed time every second
  useEffect(() => {
    if (startTime && !isCallEnded) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isCallEnded]);

  // Assign local streams to video elements
  useEffect(() => {
    if (localCameraRef.current && localStream) {
      localCameraRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (localScreenRef.current && screenStream) {
      localScreenRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  // Assign remote streams to video elements
  useEffect(() => {
    remoteVideoRefs.current = remoteVideoRefs.current.slice(0, remoteStreams.length);
    remoteStreams.forEach((stream, index) => {
      if (remoteVideoRefs.current[index]) {
        remoteVideoRefs.current[index].srcObject = stream;
      }
    });
  }, [remoteStreams]);

  // Toggle mic
  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVidOn(videoTrack.enabled);
    }
  }, [localStream]);

  if (isCallEnded) {
    return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
  }

  return (
    <div>
      {/* Connection status and timer */}
      <div className="text-center mb-2">
        {remoteStreams.length > 0 ? (
          <h3 className="font-semibold">Connected with {remoteName}</h3>
        ) : (
          <h3 className="font-semibold">Connecting to {remoteName}...</h3>
        )}
        {remoteStreams.length > 0 && (
          <div className="mt-2 mb-2 font-semibold">{formatTime(elapsedTime)}</div>
        )}
      </div>

      {/* Local Camera Stream */}
      <div>
        <h3>Your Camera</h3>
        <video ref={localCameraRef} autoPlay playsInline muted />
      </div>

      {/* Local Screen Share Stream */}
      {isScreenSharing && screenStream && (
        <div>
          <h3>Your Screen Share</h3>
          <video ref={localScreenRef} autoPlay playsInline />
        </div>
      )}

      {/* Remote Streams */}
      <div>
        <h3>Remote Streams</h3>
        {remoteStreams.map((_, index) => (
          <video
            key={index}
            ref={(el) => (remoteVideoRefs.current[index] = el)}
            autoPlay
            playsInline
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-8 flex items-center justify-center gap-4">
        {/* Screen Share Button */}
        {remoteStreams.length > 0 && (
          <button
            onClick={toggleScreenShare}
            className="px-3 py-3 bg-green-500 text-white rounded-full"
          >
            {isScreenSharing ? <MdStopScreenShare size={28} /> : <MdScreenShare size={28} />}
          </button>
        )}

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMic}
          className="px-3 py-3 bg-gray-300 text-black rounded-full"
        >
          {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
        </button>

        {/* Hangup Button */}
        <button
          className="px-3 py-3 bg-rose-500 text-white rounded-full"
          onClick={() => handleHangup({ ongoingCall })}
        >
          <ImPhoneHangUp size={30} />
        </button>

        {/* Toggle Camera Button */}
        <button
          onClick={toggleCamera}
          className="px-3 py-3 bg-gray-300 text-black rounded-full"
        >
          {isVidOn ? <MdVideocamOff size={28} /> : <MdVideocam size={28} />}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;


// "use client";

// import { useSocket } from "@/context/SocketContext";
// import VideoContainer from "./VideoContainer";
// import { useCallback, useEffect, useRef, useState } from "react";
// import {
//   MdMic,
//   MdMicOff,
//   MdVideocam,
//   MdVideocamOff,
//   MdFullscreen,
//   MdScreenShare,
//   MdStopScreenShare,
// } from "react-icons/md";
// import { ImPhoneHangUp } from "react-icons/im";
// import { useUser } from "@clerk/nextjs";

// const VideoCall = () => {
//   const {
//     localStream,
//     peer,
//     ongoingCall,
//     handleHangup,
//     isCallEnded,
//     setLocalStream,
//     toggleScreenShare,
//     isScreenSharing,
//     screenStream,
//     //swapStreams,
//     // swappedStreams,
//     onlineUsers,
//   } = useSocket();
//   const [isMicOn, setIsMicOn] = useState(true);
//   const [isVidOn, setIsVidOn] = useState(true);
//   const [showLocalStream, setShowLocalStream] = useState(true);
//   const [startTime, setStartTime] = useState(null);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const { user, isLoaded } = useUser();

  
//   const localCameraRef = useRef(null);
//   const localScreenRef = useRef(null);
//   const remoteVideoRefs = useRef([]);

//   // Set start time when the peer connection is established
//   useEffect(() => {
//     if (peer && peer.stream && !startTime) {
//       setStartTime(Date.now());
//     }
//   }, [peer, peer?.stream, startTime]);

//   // Update the elapsed time every second
//   useEffect(() => {
//     if (startTime && !isCallEnded) {
//       const interval = setInterval(() => {
//         setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [startTime, isCallEnded]);

//   // Format elapsed time into MM:SS or HH:MM:SS
//   const formatTime = (seconds) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return hrs > 0
//       ? `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
//           2,
//           "0"
//         )}:${String(secs).padStart(2, "0")}`
//       : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
//   };

//   // Update mic and video states when localStream changes
//   useEffect(() => {
//     if (localStream) {
//       const audioTrack = localStream.getAudioTracks()[0];
//       const videoTrack = localStream.getVideoTracks()[0];

//       if (audioTrack) setIsMicOn(audioTrack.enabled);
//       if (videoTrack) setIsVidOn(videoTrack.enabled);
//     }
//   }, [localStream]);

//   //: Toggle camera
 
//   const toggleCamera = useCallback(() => {
//     if (localStream) {
//       const videoTrack = localStream.getVideoTracks()[0];
//       // if (isScreenSharing) {
//       //   // Don't allow camera toggle during screen share
//       //   return;
//       // }
//       videoTrack.enabled = !videoTrack.enabled;
//       setIsVidOn(videoTrack.enabled);
//     }
//   }, [localStream, isScreenSharing]);

//   // Toggle mic
//   const toggleMic = useCallback(() => {
//     if (localStream) {
//       const audioTrack = localStream.getAudioTracks()[0];
//       audioTrack.enabled = !audioTrack.enabled;
//       setIsMicOn(audioTrack.enabled);
//     }
//   }, [localStream]);

//   // Toggle local stream visibility
//   const toggleLocalStream = () => {
//     setShowLocalStream((prev) => !prev);
//   };

//   const isOnCall = localStream && peer && ongoingCall ? true : false;
//   const currentSocketUser = onlineUsers?.find(onlineUser => onlineUser.userId === user?.id);
//   // Determine if current user is the caller
// // Change this: (fix ID comparison)
// const isCaller = user?.id === ongoingCall.participants?.caller?.userId;

// // Get local and remote participant details
// const localParticipant = isCaller 
//   ? ongoingCall.participants.caller 
//   : ongoingCall.participants.receiver;

// const remoteParticipant = isCaller 
//   ? ongoingCall.participants.receiver 
//   : ongoingCall.participants.caller;

//   if (isCallEnded) {
//     return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
//   }

//   if (!localStream && !peer) return null;

//   return (
//     <div>
//       <div>
//         <div className="mt-4 relative max-w-[800px] mx-auto">
//           {/* Show connection status and timer */}
//           {peer && peer.stream ? (
//             <div className="text-center mb-2">
//               <h3 className="font-semibold">
//                 Connected with{" "}
//                 {
//                   ongoingCall.participants?.receiver?.profile.fullName?.split(
//                     " "
//                   )[0]
//                 }
//               </h3>
//               <div className="mt-2 mb-2 font-semibold">
//                 {formatTime(elapsedTime)}
//               </div>
//             </div>
//           ) : (
//             <div className="text-center mb-2">
//               <h3 className="font-semibold">
//                 Connecting to{" "}
//                 {
//                   ongoingCall.participants?.receiver?.profile.fullName?.split(
//                     " "
//                   )[0]
//                 }
//                 ...
//               </h3>
//             </div>
//           )}

         

// {localStream && showLocalStream && (
//   <VideoContainer
//     stream={isScreenSharing && screenStream ? peer.stream : localStream}
//     isLocalStream={true}
//     isOnCall={isOnCall}
//     userName={`${localParticipant.profile.fullName.split(" ")[0]} (You)`}
//     profileImage={localParticipant.profile.imageUrl}
//     isScreenSharing={isScreenSharing}
//   />
// )}

// {peer && peer.stream && (
//   <VideoContainer
//     stream={isScreenSharing && screenStream ? screenStream : peer.stream}  
//     isLocalStream={false}
//     isOnCall={isOnCall}
//     userName={remoteParticipant.profile.fullName}
//     profileImage={remoteParticipant.profile.imageUrl || "default-avatar.jpg"}
//     isScreenSharing={isScreenSharing}
//   />
// )}
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="mt-8 flex items-center justify-center gap-4">
       
//         {/* Screen Share Button */}
//         {peer && peer.stream && (
//           <button
//             onClick={() => {
//               toggleScreenShare();
//               // swapStreams();
//             }}
//             className="px-3 py-3 bg-green-500 text-white rounded-full"
//           >
//             {isScreenSharing ? (
//               <MdStopScreenShare size={28} />
//             ) : (
//               <MdScreenShare size={28} />
//             )}
//           </button>
//         )}

//         {/* Mute/Unmute Button */}
//         <button
//           onClick={toggleMic}
//           className="px-3 py-3 bg-gray-300 text-black rounded-full"
//         >
//           {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
//         </button>

//         {/* Hangup Button */}
//         <button
//           className="px-3 py-3 bg-rose-500 text-white rounded-full"
//           onClick={() => handleHangup({ ongoingCall })}
//         >
//           <ImPhoneHangUp size={30} />
//         </button>

//         {/* Toggle Camera Button */}
//         <button
//           onClick={toggleCamera}
//           className="px-3 py-3 bg-gray-300 text-black rounded-full"
//         >
//           {isVidOn ? <MdVideocamOff size={28} /> : <MdVideocam size={28} />}
//         </button>

//         {/* Toggle Local Stream Button */}
//         {peer && peer.stream && (
//           <button
//             onClick={toggleLocalStream}
//             className="px-3 py-3 bg-blue-500 text-white rounded-full"
//           >
//             <MdFullscreen size={28} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideoCall;