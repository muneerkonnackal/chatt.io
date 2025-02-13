"use client";

import { useSocket } from "@/context/SocketContext";
import VideoCall from "./VideoCall";
import AudioCall from "./AudioCall";


const CallInterface = () => {
    const { ongoingCall } = useSocket();

    if (!ongoingCall) return null;

    return (
        <div>
            {ongoingCall.callType === "video" ? (
                <VideoCall />
            ) : ongoingCall.callType === "voice" ? (
                <AudioCall />
            ) : null}
        </div>
    );
};

export default CallInterface;