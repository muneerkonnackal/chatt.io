// // // "use client";

// // // import { useSocket } from "@/context/SocketContext";
// // // import VideoContainer from "./VideoContainer";
// // // import { useCallback, useEffect, useState } from "react";
// // // import { MdMic, MdMicOff, MdVideocam, MdVideocamOff,  MdFullscreen } from "react-icons/md";
// // // import { ImPhoneHangUp } from "react-icons/im";

// // // const VideoCall = () => {
// // //   const { localStream, peer, ongoingCall, handleHangup, isCallEnded } =
// // //     useSocket();
// // //   const [isMicOn, setIsMicOn] = useState(true);
// // //   const [isVidOn, setIsVidOn] = useState(true);
// // //   const [showLocalStream, setShowLocalStream] = useState(true);
// // //   console.log("peer", peer);
// // //   console.log("peer>>>", peer?.stream);

// // //   // useEffect(()=>{
// // //   //     if(localStream){
// // //   //         const  videoTrack = localStream.getVideoTracks()[0]
// // //   //         videoTrack.enabled = !videoTrack.enabled
// // //   //         const  audioTrack = localStream.getAudioTracks()[0]
// // //   //         audioTrack.enabled = !audioTrack.enabled
// // //   //     }
// // //   // },[localStream])
// // //   useEffect(() => {
// // //     if (localStream) {
// // //       // Initialize mic and video states based on localStream tracks
// // //       const audioTrack = localStream.getAudioTracks()[0];
// // //       const videoTrack = localStream.getVideoTracks()[0];

// // //       if (audioTrack) {
// // //         setIsMicOn(audioTrack.enabled);
// // //       }

// // //       if (videoTrack) {
// // //         setIsVidOn(videoTrack.enabled);
// // //       }
// // //     }
// // //   }, [localStream]);

// // //   const toggleCamera = useCallback(() => {
// // //     if (localStream) {
// // //       const videoTrack = localStream.getVideoTracks()[0];
// // //       videoTrack.enabled = !videoTrack.enabled;
// // //       setIsVidOn(videoTrack.enabled);
// // //     }
// // //   }, [localStream]);

// // //   const toggleMic = useCallback(() => {
// // //     if (localStream) {
// // //       const audioTrack = localStream.getAudioTracks()[0];
// // //       audioTrack.enabled = !audioTrack.enabled;
// // //       setIsMicOn(audioTrack.enabled);
// // //     }
// // //   }, [localStream]);

// // //   const toggleLocalStream = () => {
// // //     setShowLocalStream((prev) => !prev);
// // //   };

// // //   const isOnCall = localStream && peer && ongoingCall ? true : false;

// // //   if (isCallEnded) {
// // //     return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
// // //   }

// // //   if (!localStream && !peer) return;

// // //   return (
// // //     <div>
// // //       <div>
// // //         <div className="mt-4 relative max-w-[800px] mx-auto">
// // //           {localStream && (
// // //             <>
// // //              {!peer && <h3 className="font-semibold">
// // //                 Connecting...
// // //                 {
// // //                   ongoingCall.participants?.receiver?.profile.fullName?.split(
// // //                     " "
// // //                   )[0]
// // //                 }
// // //               </h3>}
// // //               {/* <VideoContainer
// // //                 stream={localStream}
// // //                 isLocalStream={true}
// // //                 isOnCall={isOnCall}
// // //               /> */}

// // // <VideoContainer
// // //   stream={localStream}
// // //   isLocalStream={true}
// // //   isOnCall={isOnCall}
// // //   userName="You"
// // //   profileImage={ongoingCall.participants?.receiver?.profile.imageUrl}
// // // />
// // //             </>
// // //           )}

// // //           {peer && peer.stream && (
// // //             <>
// // //               {/* <h3 className="font-semibold">
// // //                 {
// // //                   ongoingCall.participants?.caller?.profile.fullName?.split(
// // //                     " "
// // //                   )[0]
// // //                 }
// // //               </h3> */}
// // //               {/* <VideoContainer
// // //                 stream={peer.stream}
// // //                 isLocalStream={false}
// // //                 isOnCall={isOnCall}
// // //               /> */}

// // // <VideoContainer
// // //     stream={peer.stream}
// // //     isLocalStream={false}
// // //     isOnCall={isOnCall}
// // //     userName={ongoingCall.participants?.caller?.profile.fullName || "Caller"}
// // //     profileImage={ongoingCall.participants?.caller?.profile.imageUrl || "default-avatar.jpg"}
// // //   />
// // //             </>
// // //           )}
// // //         </div>
// // //       </div>

// // //       <div className="mt-8 flex items-center justify-center">
// // //         <button
// // //           onClick={toggleMic}
// // //           className="px-3 py-3 bg-gray-300 text-black rounded-full "
// // //         >
// // //           {isMicOn && <MdMic size={28} />}
// // //           {!isMicOn && <MdMicOff size={28} />}
// // //         </button>

// // //         <button
// // //           className="px-3 py-3 bg-rose-500 text-white rounded-full mx-4"
// // //           onClick={() => handleHangup({ ongoingCall })}
// // //         >
// // //           <ImPhoneHangUp size={30} />
// // //         </button>

// // //         <button
// // //           onClick={toggleCamera}
// // //           className="px-3 py-3 bg-gray-300 text-black rounded-full "
// // //         >
// // //           {isVidOn && <MdVideocamOff size={28} />}
// // //           {!isVidOn && <MdVideocam size={28} />}
// // //         </button>

// // //           {/* Toggle Local Stream Button */}
// // //           <button onClick={toggleLocalStream} className="px-3 py-3 bg-blue-500 text-white rounded-full">
// // //           <MdFullscreen size={28} />
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default VideoCall;

// // "use client";

// // import { useSocket } from "@/context/SocketContext";
// // import VideoContainer from "./VideoContainer";
// // import { useCallback, useEffect, useRef, useState } from "react";
// // import { MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdFullscreen, MdScreenShare, MdStopScreenShare  } from "react-icons/md";
// // import { ImPhoneHangUp } from "react-icons/im";

// // const VideoCall = () => {
// //   const { localStream,setLocalStream, peer, ongoingCall, handleHangup, isCallEnded } = useSocket();
// //   const [isMicOn, setIsMicOn] = useState(true);
// //   const [isVidOn, setIsVidOn] = useState(true);
// //   const [showLocalStream, setShowLocalStream] = useState(true);
// //   const [isScreenSharing, setIsScreenSharing] = useState(false);
// //   const screenStreamRef = useRef(null);
// //   const [startTime, setStartTime] = useState(null);
// //     const [elapsedTime, setElapsedTime] = useState(0);

// //   useEffect(() => {
// //     if (localStream) {
// //       const audioTrack = localStream.getAudioTracks()[0];
// //       const videoTrack = localStream.getVideoTracks()[0];

// //       if (audioTrack) setIsMicOn(audioTrack.enabled);
// //       if (videoTrack) setIsVidOn(videoTrack.enabled);
// //     }
// //   }, [localStream]);

// //   const toggleCamera = useCallback(() => {
// //     if (localStream) {
// //       const videoTrack = localStream.getVideoTracks()[0];
// //       videoTrack.enabled = !videoTrack.enabled;
// //       setIsVidOn(videoTrack.enabled);
// //     }
// //   }, [localStream]);

// //   const toggleMic = useCallback(() => {
// //     if (localStream) {
// //       const audioTrack = localStream.getAudioTracks()[0];
// //       audioTrack.enabled = !audioTrack.enabled;
// //       setIsMicOn(audioTrack.enabled);
// //     }
// //   }, [localStream]);

// //    // Update the elapsed time every second
// //    useEffect(() => {
// //     if (startTime && !isCallEnded) {
// //         const interval = setInterval(() => {
// //             setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
// //         }, 1000);

// //         return () => clearInterval(interval);
// //     }
// // }, [startTime, isCallEnded]);
// // useEffect(() => {
// //     if (peer && peer.stream && !startTime) {
// //       setStartTime(Date.now());
// //     }
// //   }, [peer, peer?.stream, startTime]);

// //   // Convert seconds to HH:MM:SS format
// //   const formatTime = (seconds) => {
// //     const hrs = Math.floor(seconds / 3600);
// //     const mins = Math.floor((seconds % 3600) / 60);
// //     const secs = seconds % 60;

// //     if (hrs === 0 && mins < 59) {
// //         // Show MM:SS format when hours are 0 and minutes are less than 59
// //         return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
// //     } else {
// //         // Show HH:MM:SS format when minutes reach 59
// //         return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
// //     }
// // };

// //   const toggleLocalStream = () => {
// //     setShowLocalStream((prev) => !prev);
// //   };

// //   const toggleScreenShare = async () => {
// //     if (!isScreenSharing) {
// //       try {
// //         const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
// //         screenStreamRef.current = screenStream;
// //         setLocalStream(screenStream);
// //         setIsScreenSharing(true);

// //         // Listen for when user stops screen sharing manually
// //         screenStream.getVideoTracks()[0].onended = () => {
// //           toggleScreenShare();
// //         };
// //       } catch (error) {
// //         console.error("Error sharing screen:", error);
// //       }
// //     } else {
// //       // Stop screen sharing and switch back to the original camera
// //       screenStreamRef.current?.getTracks().forEach((track) => track.stop());
// //       setLocalStream(await navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
// //       setIsScreenSharing(false);
// //     }
// //   };

// //   const isOnCall = localStream && peer && ongoingCall ? true : false;

// //   if (isCallEnded) {
// //     return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
// //   }

// //   if (!localStream && !peer) return;

// //   return (
// //     <div>
// //       <div>
// //         <div className="mt-4 relative max-w-[800px] mx-auto">
// //           {/* Local Video */}
// //           {localStream && showLocalStream && (
// //             <>
// //               {!peer ? (
// //                 <h3 className="font-semibold">
// //                   Connecting... {ongoingCall.participants?.receiver?.profile.fullName?.split(" ")[0]}
// //                 </h3>
// //               ): (
// //                 <h3 className="font-semibold">
// //                   Connected with {ongoingCall.participants?.receiver?.profile.fullName?.split(" ")[0]}
// //                 </h3>
// //               )}
// //                <div className="mt-2 mb-2 font-semibold  "> {peer && peer.stream && `${formatTime(elapsedTime)}`}</div>
// //               <VideoContainer
// //                 stream={localStream}
// //                 isLocalStream={true}
// //                 isOnCall={isOnCall}
// //                 userName="You"
// //                 profileImage={ongoingCall.participants?.receiver?.profile.imageUrl}
// //               />
// //             </>
// //           )}

// //           {/* Remote Video */}
// //           {peer && peer.stream && (
// //             <VideoContainer
// //               stream={peer.stream}
// //               isLocalStream={false}
// //               isOnCall={isOnCall}
// //               userName={ongoingCall.participants?.caller?.profile.fullName || "Caller"}
// //               profileImage={ongoingCall.participants?.caller?.profile.imageUrl || "default-avatar.jpg"}
// //             />
// //           )}
// //         </div>
// //       </div>

// //       <div className="mt-8 flex items-center justify-center gap-4">

// //         {/* Screen Share Button */}
// //        {peer && peer.stream &&  <button onClick={toggleScreenShare} className="px-3 py-3 bg-green-500 text-white rounded-full">
// //           {isScreenSharing ? <MdStopScreenShare size={28} /> : <MdScreenShare size={28} />}
// //         </button>}

// //         <button onClick={toggleMic} className="px-3 py-3 bg-gray-300 text-black rounded-full">
// //           {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
// //         </button>

// //         <button className="px-3 py-3 bg-rose-500 text-white rounded-full" onClick={() => handleHangup({ ongoingCall })}>
// //           <ImPhoneHangUp size={30} />
// //         </button>

// //         <button onClick={toggleCamera} className="px-3 py-3 bg-gray-300 text-black rounded-full">
// //           {isVidOn ? <MdVideocamOff size={28} /> : <MdVideocam size={28} />}
// //         </button>

// //         {/* Toggle Local Stream Button */}
// //       {peer && peer.stream &&   <button onClick={toggleLocalStream} className="px-3 py-3 bg-blue-500 text-white rounded-full">
// //           <MdFullscreen size={28} />
// //         </button>}
// //       </div>
// //     </div>
// //   );
// // };

// // export default VideoCall;

// "use client";

// import { useSocket } from "@/context/SocketContext";
// import VideoContainer from "./VideoContainer";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdFullscreen, MdScreenShare, MdStopScreenShare } from "react-icons/md";
// import { ImPhoneHangUp } from "react-icons/im";

// const VideoCall = () => {
//   const { localStream, peer, ongoingCall, handleHangup, isCallEnded , setLocalStream} = useSocket();
//   const [isMicOn, setIsMicOn] = useState(true);
//   const [isVidOn, setIsVidOn] = useState(true);
//   const [showLocalStream, setShowLocalStream] = useState(true);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const screenStreamRef = useRef(null);
//   const [startTime, setStartTime] = useState(null);
//   const [elapsedTime, setElapsedTime] = useState(0);

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
//       ? `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
//       : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
//   };

//   useEffect(() => {
//     if (localStream) {
//       const audioTrack = localStream.getAudioTracks()[0];
//       const videoTrack = localStream.getVideoTracks()[0];

//       if (audioTrack) setIsMicOn(audioTrack.enabled);
//       if (videoTrack) setIsVidOn(videoTrack.enabled);
//     }
//   }, [localStream]);

//   const toggleCamera = useCallback(() => {
//     if (localStream) {
//       const videoTrack = localStream.getVideoTracks()[0];
//       videoTrack.enabled = !videoTrack.enabled;
//       setIsVidOn(videoTrack.enabled);
//     }
//   }, [localStream]);

//   const toggleMic = useCallback(() => {
//     if (localStream) {
//       const audioTrack = localStream.getAudioTracks()[0];
//       audioTrack.enabled = !audioTrack.enabled;
//       setIsMicOn(audioTrack.enabled);
//     }
//   }, [localStream]);

//   const toggleLocalStream = () => {
//     setShowLocalStream((prev) => !prev);
//   };

//   // In the toggleScreenShare function of VideoCall component
//   const toggleScreenShare = async () => {
//     if (!isScreenSharing) {
//       try {
//         const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
//         screenStreamRef.current = screenStream;
//         setIsScreenSharing(true);

//         // Stop existing local stream tracks
//         if (localStream) {
//           localStream.getTracks().forEach(track => track.stop());
//         }

//         setLocalStream(screenStream);

//         const screenTrack = screenStream.getVideoTracks()[0];
//         if (peer && peer._pc) {
//           const senders = peer._pc.getSenders();
//           const videoSender = senders.find(s => s.track?.kind === "video");

//           if (videoSender) {
//             await videoSender.replaceTrack(screenTrack);
//             console.log("✅ Screen sharing started");
//           }
//         }

//         screenTrack.onended = () => {
//           if (isScreenSharing) {
//             toggleScreenShare();
//           }
//         };
//       } catch (error) {
//         console.error("❌ Error sharing screen:", error);
//       }
//     } else {
//       try {
//         screenStreamRef.current?.getTracks().forEach(track => track.stop());
//         setIsScreenSharing(false);

//         // Get new camera stream
//         const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         setLocalStream(cameraStream);

//         const cameraTrack = cameraStream.getVideoTracks()[0];
//         if (peer && peer._pc) {
//           const senders = peer._pc.getSenders();
//           const videoSender = senders.find(s => s.track?.kind === "video");

//           if (videoSender) {
//             await videoSender.replaceTrack(cameraTrack);
//             console.log("✅ Switched back to camera");
//           }
//         }
//       } catch (error) {
//         console.error("❌ Error accessing camera:", error);
//       }
//     }
//   };

//   const isOnCall = localStream && peer && ongoingCall ? true : false;

//   if (isCallEnded) {
//     return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
//   }

//   if (!localStream && !peer) return null;

//   return (
//     <div>
//       <div>
//         <div className="mt-4 relative max-w-[800px] mx-auto">
//           {/* Show connection status and timer even if localStream is hidden */}
//           {peer && peer.stream ? (
//             <div className="text-center mb-2">
//               <h3 className="font-semibold">
//                 Connected with {ongoingCall.participants?.receiver?.profile.fullName?.split(" ")[0]}
//               </h3>
//               <div className="mt-2 mb-2 font-semibold">{formatTime(elapsedTime)}</div>
//             </div>
//           ) :
//           <div className="text-center mb-2">
//           <h3 className="font-semibold">
//             Connecting to  {ongoingCall.participants?.receiver?.profile.fullName?.split(" ")[0]}...
//           </h3>
//           {/* <div className="mt-2 mb-2 font-semibold">{formatTime(elapsedTime)}</div> */}
//         </div>
//           }

//           {/* Local Video */}
//           {localStream && showLocalStream && (
//             <VideoContainer
//               stream={localStream}
//               isLocalStream={true}
//               isOnCall={isOnCall}
//               userName={`${ongoingCall.participants?.receiver?.profile.fullName?.split(' ')[0]} (You)`}
//               profileImage={ongoingCall.participants?.receiver?.profile.imageUrl}
//             />
//           )}

//           {/* Remote Video */}
//           {peer && peer.stream && (
//             <VideoContainer
//               stream={peer.stream}
//               isLocalStream={false}
//               isOnCall={isOnCall}
//               userName={ongoingCall.participants?.caller?.profile.fullName || "Caller"}
//               profileImage={ongoingCall.participants?.caller?.profile.imageUrl || "default-avatar.jpg"}
//             />
//           )}
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="mt-8 flex items-center justify-center gap-4">
//         {/* Screen Share Button */}
//         {peer && peer.stream && (
//           <button onClick={toggleScreenShare} className="px-3 py-3 bg-green-500 text-white rounded-full">
//             {isScreenSharing ? <MdStopScreenShare size={28} /> : <MdScreenShare size={28} />}
//           </button>
//         )}

//         {/* Mute/Unmute Button */}
//         <button onClick={toggleMic} className="px-3 py-3 bg-gray-300 text-black rounded-full">
//           {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
//         </button>

//         {/* Hangup Button */}
//         <button className="px-3 py-3 bg-rose-500 text-white rounded-full" onClick={() => handleHangup({ ongoingCall })}>
//           <ImPhoneHangUp size={30} />
//         </button>

//         {/* Toggle Camera Button */}
//         <button onClick={toggleCamera} className="px-3 py-3 bg-gray-300 text-black rounded-full">
//           {isVidOn ? <MdVideocamOff size={28} /> : <MdVideocam size={28} />}
//         </button>

//         {/* Toggle Local Stream Button */}
//         {peer && peer.stream && (
//           <button onClick={toggleLocalStream} className="px-3 py-3 bg-blue-500 text-white rounded-full">
//             <MdFullscreen size={28} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VideoCall;

"use client";

import { useSocket } from "@/context/SocketContext";
import VideoContainer from "./VideoContainer";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
  MdFullscreen,
  MdScreenShare,
  MdStopScreenShare,
} from "react-icons/md";
import { ImPhoneHangUp } from "react-icons/im";
import { useUser } from "@clerk/nextjs";

const VideoCall = () => {
  const {
    localStream,
    peer,
    ongoingCall,
    handleHangup,
    isCallEnded,
    setLocalStream,
    toggleScreenShare,
    isScreenSharing,
    screenStream,
    // swapStreams,
    // swappedStreams,
    onlineUsers,
  } = useSocket();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVidOn, setIsVidOn] = useState(true);
  const [showLocalStream, setShowLocalStream] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { user, isLoaded } = useUser();

  // Set start time when the peer connection is established
  useEffect(() => {
    if (peer && peer.stream && !startTime) {
      setStartTime(Date.now());
    }
  }, [peer, peer?.stream, startTime]);

  // Update the elapsed time every second
  useEffect(() => {
    if (startTime && !isCallEnded) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime, isCallEnded]);

  // Format elapsed time into MM:SS or HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0
      ? `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
          2,
          "0"
        )}:${String(secs).padStart(2, "0")}`
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

  //: Toggle camera
  // const toggleCamera = useCallback(() => {
  //   if (localStream) {
  //     const videoTrack = localStream.getVideoTracks()[0];
  //     videoTrack.enabled = !videoTrack.enabled;
  //     setIsVidOn(videoTrack.enabled);
  //   }
  // }, [localStream]);
  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      // if (isScreenSharing) {
      //   // Don't allow camera toggle during screen share
      //   return;
      // }
      videoTrack.enabled = !videoTrack.enabled;
      setIsVidOn(videoTrack.enabled);
    }
  }, [localStream, isScreenSharing]);

  // Toggle mic
  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  // Toggle local stream visibility
  const toggleLocalStream = () => {
    setShowLocalStream((prev) => !prev);
  };

  const isOnCall = localStream && peer && ongoingCall ? true : false;
  const currentSocketUser = onlineUsers?.find(onlineUser => onlineUser.userId === user?.id);
  // Determine if current user is the caller
// Change this: (fix ID comparison)
const isCaller = user?.id === ongoingCall.participants?.caller?.userId;

// Get local and remote participant details
const localParticipant = isCaller 
  ? ongoingCall.participants.caller 
  : ongoingCall.participants.receiver;

const remoteParticipant = isCaller 
  ? ongoingCall.participants.receiver 
  : ongoingCall.participants.caller;

  if (isCallEnded) {
    return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
  }

  if (!localStream && !peer) return null;

  return (
    <div>
      <div>
        <div className="mt-4 relative max-w-[800px] mx-auto">
          {/* Show connection status and timer */}
          {peer && peer.stream ? (
            <div className="text-center mb-2">
              <h3 className="font-semibold">
                Connected with{" "}
                {
                  ongoingCall.participants?.receiver?.profile.fullName?.split(
                    " "
                  )[0]
                }
              </h3>
              <div className="mt-2 mb-2 font-semibold">
                {formatTime(elapsedTime)}
              </div>
            </div>
          ) : (
            <div className="text-center mb-2">
              <h3 className="font-semibold">
                Connecting to{" "}
                {
                  ongoingCall.participants?.receiver?.profile.fullName?.split(
                    " "
                  )[0]
                }
                ...
              </h3>
            </div>
          )}

          {/* Local Video */}
          {/* {localStream && showLocalStream && (
            <VideoContainer
              stream={localStream}
              isLocalStream={true}
              isOnCall={isOnCall}
              userName={ongoingCall.participants?.receiver?.profile.fullName?.split(" ")[0] || "You"}
              profileImage={ongoingCall.participants?.receiver?.profile.imageUrl}
            />
          )} */}


          {/* {localStream && showLocalStream && (
            <VideoContainer
              stream={localStream}
              isLocalStream={true}
              isOnCall={isOnCall}
              userName={
                ongoingCall.participants?.receiver?.profile.fullName?.split(
                  " "
                )[0] || "You"
              }
              profileImage={
                ongoingCall.participants?.receiver?.profile.imageUrl
              }
              isScreenSharing={isScreenSharing}
            />
          )} */}

{localStream && showLocalStream && (
  <VideoContainer
    stream={isScreenSharing && screenStream ? peer.stream : localStream}
    isLocalStream={true}
    isOnCall={isOnCall}
    userName={`${localParticipant.profile.fullName.split(" ")[0]} (You)`}
    profileImage={localParticipant.profile.imageUrl}
    isScreenSharing={isScreenSharing}
  />
)}

          {/* Remote Video */}
          {/* {peer && peer.stream && (
            <VideoContainer
              stream={peer.stream}
              isLocalStream={false}
              isOnCall={isOnCall}
              userName={ongoingCall.participants?.caller?.profile.fullName || "Caller"}
              profileImage={ongoingCall.participants?.caller?.profile.imageUrl || "default-avatar.jpg"}
            />
          )} */}
          

          {/* Remote Video for A or B */}
          {/* {peer && peer.stream && (
            <VideoContainer
              stream={
                isScreenSharing && screenStream ? screenStream : peer.stream
              }
              isLocalStream={false}
              isOnCall={isOnCall}
              userName={
                ongoingCall.participants?.caller?.profile.fullName || "Caller"
              }
              profileImage={
                ongoingCall.participants?.caller?.profile.imageUrl ||
                "default-avatar.jpg"
              }
              isScreenSharing={isScreenSharing}
            />
          )} */}

{peer && peer.stream && (
  <VideoContainer
    stream={isScreenSharing && screenStream ? screenStream : peer.stream}  
    isLocalStream={false}
    isOnCall={isOnCall}
    userName={remoteParticipant.profile.fullName}
    profileImage={remoteParticipant.profile.imageUrl || "default-avatar.jpg"}
    isScreenSharing={isScreenSharing}
  />
)}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex items-center justify-center gap-4">
        {/* Screen Share Button */}
        {/* Screen Share Button */}
        {/* {peer && peer.stream && (
          <button
            onClick={toggleScreenShare}
            className="px-3 py-3 bg-green-500 text-white rounded-full"
          >
            {isScreenSharing ? (
              <MdStopScreenShare size={28} />
            ) : (
              <MdScreenShare size={28} />
            )}
          </button>
        )} */}
        {/* Screen Share Button */}
        {peer && peer.stream && (
          <button
            onClick={() => {
              toggleScreenShare();
              // swapStreams();
            }}
            className="px-3 py-3 bg-green-500 text-white rounded-full"
          >
            {isScreenSharing ? (
              <MdStopScreenShare size={28} />
            ) : (
              <MdScreenShare size={28} />
            )}
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

        {/* Toggle Local Stream Button */}
        {peer && peer.stream && (
          <button
            onClick={toggleLocalStream}
            className="px-3 py-3 bg-blue-500 text-white rounded-full"
          >
            <MdFullscreen size={28} />
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
