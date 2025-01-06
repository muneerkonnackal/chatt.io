"use client"

import { useSocket } from "@/context/SocketContext"
import VideoContainer from "./VideoContainer"
import { useCallback, useEffect, useState } from "react"
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md"

const VideoCall = () => {
    const {localStream, peer, ongoingCall, handleHangup, isCallEnded} = useSocket()
    const [isMicOn, setIsMicOn] = useState(true)
    const [isVidOn, setIsVidOn] = useState(true)
    
    console.log('peer',peer);
    console.log('peer>>>', peer?.stream);
    

    // useEffect(()=>{
    //     if(localStream){
    //         const  videoTrack = localStream.getVideoTracks()[0]
    //         videoTrack.enabled = !videoTrack.enabled
    //         const  audioTrack = localStream.getAudioTracks()[0]
    //         audioTrack.enabled = !audioTrack.enabled
    //     }
    // },[localStream])
    useEffect(() => {
                if (localStream) {
                    // Initialize mic and video states based on localStream tracks
                    const audioTrack = localStream.getAudioTracks()[0];
                    const videoTrack = localStream.getVideoTracks()[0];
        
                    if (audioTrack) {
                        setIsMicOn(audioTrack.enabled);
                    }
        
                    if (videoTrack) {
                        setIsVidOn(videoTrack.enabled);
                    }
                }
            }, [localStream]);

    const toggleCamera = useCallback(() =>{
        if(localStream){
            const  videoTrack = localStream.getVideoTracks()[0]
            videoTrack.enabled = !videoTrack.enabled
            setIsVidOn(videoTrack.enabled)
        }
    },[localStream])

    const toggleMic = useCallback(() =>{
        if(localStream){
            const  audioTrack = localStream.getAudioTracks()[0]
            audioTrack.enabled = !audioTrack.enabled
            setIsMicOn(audioTrack.enabled)
        }
    },[localStream])

    const isOnCall = localStream && peer && ongoingCall ? true : false;

    if(isCallEnded){
        return <div className="mt-5 text-rose-500 text-center">Call Ended</div>
    }

    if(!localStream && !peer) return;
    
  return (
    <div>
        <div className="mt-4 relative max-w-[800px] mx-auto">
        {localStream && <VideoContainer stream={localStream} isLocalStream={true} isOnCall={isOnCall}  /> }
        {peer && peer.stream && <VideoContainer stream={peer.stream} isLocalStream={false} isOnCall={isOnCall}/>}
        </div>
        <div className="mt-8 flex items-center justify-center">
             <button onClick={toggleMic}>
                {isMicOn && <MdMic size={28}/>}
                {!isMicOn && <MdMicOff size={28}/>}
             </button>


             <button className="px-4 py-2 bg-rose-500 text-white rounded mx-4" onClick={()=> handleHangup({ongoingCall})}>
                End Call
             </button>

             <button onClick={toggleCamera}>
             {isVidOn && <MdVideocamOff size={28}/>}
             {!isVidOn && <MdVideocam size={28}/>}
             </button>
        </div>
    </div>
  )
}

export default VideoCall

// "use client";

// import { useSocket } from "@/context/SocketContext";
// import VideoContainer from "./VideoContainer";
// import { useCallback, useEffect, useState } from "react";
// import { MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

// const VideoCall = () => {
//     const { localStream, peer, ongoingCall } = useSocket();

//     const [isMicOn, setIsMicOn] = useState(true);
//     const [isVidOn, setIsVidOn] = useState(true);

//     useEffect(() => {
//         if (localStream) {
//             // Initialize mic and video states based on localStream tracks
//             const audioTrack = localStream.getAudioTracks()[0];
//             const videoTrack = localStream.getVideoTracks()[0];

//             if (audioTrack) {
//                 setIsMicOn(audioTrack.enabled);
//             }

//             if (videoTrack) {
//                 setIsVidOn(videoTrack.enabled);
//             }
//         }
//     }, [localStream]);

//     const toggleCamera = useCallback(() => {
//         if (localStream) {
//             const videoTrack = localStream.getVideoTracks()[0];
//             if (videoTrack) {
//                 videoTrack.enabled = !videoTrack.enabled;
//                 setIsVidOn(videoTrack.enabled);
//             }
//         }
//     }, [localStream]);

//     const toggleMic = useCallback(() => {
//         if (localStream) {
//             const audioTrack = localStream.getAudioTracks()[0];
//             if (audioTrack) {
//                 audioTrack.enabled = !audioTrack.enabled;
//                 setIsMicOn(audioTrack.enabled);
//             }
//         }
//     }, [localStream]);

//     const isOnCall = localStream && peer && ongoingCall ? true : false;

//     return (
//         <div>
//             <div className="mt-4 relative">
//                 {localStream && (
//                     <VideoContainer
//                         stream={localStream}
//                         isLocalStream={true}
//                         isOnCall={isOnCall}
//                     />
//                 )}
//                 {peer && peer.stream && (
//                     <VideoContainer
//                         stream={peer.stream}
//                         isLocalStream={false}
//                         isOnCall={isOnCall}
//                     />
//                 )}
//             </div>
//             <div className="mt-8 flex items-center justify-center">
//                 <button onClick={toggleMic}>
//                     {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
//                 </button>

//                 <button
//                     className="px-4 py-2 bg-rose-500 text-white rounded mx-4"
//                     onClick={() => {
//                         // Add hangup logic here if needed
//                     }}
//                 >
//                     End Call
//                 </button>

//                 <button onClick={toggleCamera}>
//                     {isVidOn ? <MdVideocam size={28} /> : <MdVideocamOff size={28} />}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default VideoCall;
