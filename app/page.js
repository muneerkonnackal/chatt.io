"use client";
import AudioCall from "@/components/AudioCall";
// import CallerNotification from "@/components/CallerNotification";
import CallNotification from "@/components/CallNotification";
// import CallScreen from "@/components/CallScreen";
import ListOnlineUsers from "@/components/ListOnlineUsers";
import VideoCall from "@/components/VideoCall";

import { useSocket } from "@/context/SocketContext";
import Image from "next/image";

export default function Home() {
  const { ongoingCall, isCallEnded } = useSocket();
  return (
    <div>
      <ListOnlineUsers />
      <CallNotification />
      {/* <CallerNotification/> */}

      {ongoingCall && (
        <>
          {ongoingCall.callType === "video" && <VideoCall />}
          {ongoingCall.callType === "voice" && <AudioCall />}
        </>
      )}

      {/* Display "Call Ended" message outside the call components */}
      {isCallEnded && (
        <div className="mt-5 text-rose-500 text-center">Call Ended</div>
      )}

      {/* <VideoCall /> */}
    </div>
  );
}
