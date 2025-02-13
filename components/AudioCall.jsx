"use client";

import { useSocket } from "@/context/SocketContext";
import { useCallback, useEffect, useState } from "react";
import { MdMic, MdMicOff } from "react-icons/md";
import { ImPhoneHangUp } from "react-icons/im";
import VoiceContainer from "./VoiceContainer";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import Avatar from "./Avatar";
import { useUser } from "@clerk/nextjs";
import ReactDOM from 'react-dom';
import Countdown from 'react-countdown';
import Loader from "./Loader";

const AudioCall = () => {
    const { localStream, peer, ongoingCall, handleHangup, isCallEnded } = useSocket();
    const [isMicOn, setIsMicOn] = useState(true);
    const [audioLevel, setAudioLevel] = useState(0);
    const { user } = useUser(); // ✅ Get logged-in user detail
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    
    useEffect(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                setIsMicOn(audioTrack.enabled);
            }
        }
    }, [localStream]);

     // Start the timer when the call connects
     useEffect(() => {
        if (ongoingCall && !startTime) {
            setStartTime(Date.now()); // Set the start time
        }
    }, [ongoingCall, startTime]);

    // Update the elapsed time every second
    useEffect(() => {
        if (startTime && !isCallEnded) {
            const interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);

            return () => clearInterval(interval); 
        }
    }, [startTime, isCallEnded]);

  

   
      // Convert seconds to HH:MM:SS format
      const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
    
        if (hrs === 0 && mins < 59) {
            // Show MM:SS format when hours are 0 and minutes are less than 59
            return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        } else {
            // Show HH:MM:SS format when minutes reach 59
            return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        }
    };
    

    const toggleMic = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    }, [localStream]);

    if (!localStream && !peer) return null;


    return (
        <div>
            {!isCallEnded && (
                <>
                    <div className="mt-4 relative max-w-[800px] mx-auto">
                        <div className="text-center text-lg font-semibold">
                            {ongoingCall?.callType === "voice" ? "Voice Call in Progress" : "Call in Progress"}
                        </div>

                        {localStream && <VoiceContainer stream={localStream} isLocalStream={true} />}
                        {peer && peer.stream && <VoiceContainer stream={peer.stream} isLocalStream={false} />}
                    </div>

                    <div className="flex flex-col items-center mt-4">
                        {/* ✅ Fix: Correctly show caller or receiver based on user.id */}
                        {user?.id === ongoingCall?.participants?.caller?.userId ? (
                            <>
                                <Avatar src={ongoingCall.participants?.receiver?.profile?.imageUrl} />
                                <h3>{ongoingCall.participants?.receiver?.profile?.fullName?.split(" ")[0]}</h3>
                            </>
                        ) : (
                            <>
                                <Avatar src={ongoingCall.participants?.caller?.profile?.imageUrl} />
                                <h3>{ongoingCall.participants?.caller?.profile?.fullName?.split(" ")[0]}</h3>
                            </>
                        )}

                       <div className="mt-2 mb-2 font-semibold  "> {peer && peer.stream && `${formatTime(elapsedTime)}`}</div>
                        {/* {peer && peer.stream &&  <Loader />} */}
                       
                    </div>
                    

                    <div className="mt-2 flex items-center justify-center">
                        <button onClick={toggleMic} className="px-3 py-3 bg-gray-300 text-black rounded-full">
                            {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
                        </button>

                        <button
                            className="px-3 py-3 bg-rose-500 text-white rounded-full mx-4"
                            onClick={() => handleHangup({ ongoingCall })}
                        >
                            <ImPhoneHangUp size={30} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AudioCall;


// "use client";
// import { useSocket } from "@/context/SocketContext";
// import { useEffect, useState } from "react";
// import { MdMic, MdMicOff } from "react-icons/md";
// import { ImPhoneHangUp } from "react-icons/im";
// import Avatar from "./Avatar";
// import { useUser } from "@clerk/nextjs";
// import Loader from "./Loader";

// const AudioCall = () => {
//     const { localStream, peer, ongoingCall, handleHangup, isCallEnded } = useSocket();
//     const { user } = useUser();
//     const [isMicOn, setIsMicOn] = useState(true);
//     const [audioLevel, setAudioLevel] = useState(0);

//     useEffect(() => {
//         if (!localStream) return;

//         const audioContext = new AudioContext();
//         const analyser = audioContext.createAnalyser();
//         const source = audioContext.createMediaStreamSource(localStream);
//         source.connect(analyser);

//         analyser.fftSize = 256; // Set FFT size (lower for smoother response)
//         const bufferLength = analyser.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);

//         const updateVolume = () => {
//             analyser.getByteTimeDomainData(dataArray);
//             let sum = 0;
//             for (let i = 0; i < bufferLength; i++) {
//                 sum += (dataArray[i] - 128) ** 2; // Calculate energy level
//             }
//             setAudioLevel(Math.sqrt(sum / bufferLength) * 10); // Normalize and scale

//             requestAnimationFrame(updateVolume);
//         };

//         updateVolume();

//         return () => {
//             audioContext.close();
//         };
//     }, [localStream]);

//     const toggleMic = () => {
//         if (localStream) {
//             const audioTrack = localStream.getAudioTracks()[0];
//             audioTrack.enabled = !audioTrack.enabled;
//             setIsMicOn(audioTrack.enabled);
//         }
//     };

//     if (!localStream && !peer) return null;

//     return (
//         <div>
//             {!isCallEnded && (
//                 <>
//                     <div className="mt-4 relative max-w-[800px] mx-auto">
//                         <div className="text-center text-lg font-semibold">
//                             {ongoingCall?.callType === "voice" ? "Voice Call in Progress" : "Call in Progress"}
//                         </div>

//                         {/* Voice Visualization */}
//                         {/* {peer && peer.stream && <Loader audioLevel={audioLevel} />} */}
//                     </div>

//                     <div className="mt-8 flex items-center justify-center">
//                         <button onClick={toggleMic} className="px-3 py-3 bg-gray-300 text-black rounded-full">
//                             {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
//                         </button>

//                         <button
//                             className="px-3 py-3 bg-rose-500 text-white rounded-full mx-4"
//                             onClick={() => handleHangup({ ongoingCall })}
//                         >
//                             <ImPhoneHangUp size={30} />
//                         </button>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default AudioCall;

