"use client";

import { useSocket } from "@/context/SocketContext";
import VideoContainer from "./VideoContainer";
import { useCallback, useEffect, useState } from "react";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdOutlineStopScreenShare, MdOutlineScreenShare  } from "react-icons/md";
import { ImPhoneHangUp } from "react-icons/im";
import { useUser } from "@clerk/nextjs";

const VideoCall = () => {
    const { localStream, peer, ongoingCall, handleHangup, isCallEnded } = useSocket();
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVidOn, setIsVidOn] = useState(true);
    const { user, isLoaded } = useUser();

    const [isAdmin, setIsAdmin] = useState(false);

    const ADMIN_EMAIL = "muneer@steyp.com"; // Define the admin email

    useEffect(() => {
        if (isLoaded && user) {
            const userEmail = user.emailAddresses ? user.emailAddresses[0].emailAddress : null;
            setIsAdmin(userEmail === ADMIN_EMAIL);
        }
    }, [user, isLoaded]);

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

    const toggleCamera = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVidOn(videoTrack.enabled);
        }
    }, [localStream]);

    const toggleMic = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    }, [localStream]);

   
    



    const isOnCall = localStream && peer && ongoingCall ? true : false;

    if (isCallEnded && isAdmin) {
        return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
    }

    if (!localStream && !peer) return null;

    // Check if the logged-in user is the admin
    // if (!isAdmin) {
    //     return null; // Return early if the user is not the admin
    // }

    return (
        <div>
            <div className="mt-4 relative max-w-[800px] mx-auto">
                {localStream && <VideoContainer stream={localStream} isLocalStream={true} isOnCall={isOnCall} />}
                {peer && peer.stream && <VideoContainer stream={peer.stream} isLocalStream={false} isOnCall={isOnCall} />}
            </div>
            {isOnCall && (
                <div className="mt-8 gap-2 flex items-center justify-center">
                    <button onClick={toggleMic}>
                        {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
                    </button>

                    <button onClick={toggleCamera}>
                        {isVidOn ? <MdVideocamOff size={28} /> : <MdVideocam size={28} />}
                    </button>

                    <button className=" bg-rose-500 text-white rounded-full p-2 " onClick={() => handleHangup({ ongoingCall })}>
                        <ImPhoneHangUp />
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoCall;