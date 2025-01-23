// "use client"
import CallerNotification from "@/components/CallerNotification";
import CallNotification from "@/components/CallNotification";
import CallScreen from "@/components/CallScreen";
import ListOnlineUsers from "@/components/ListOnlineUsers";
import VideoCall from "@/components/VideoCall";
import { useSocket } from "@/context/SocketContext";
import Image from "next/image";

export default function Home() {

  // const { ongoingVoiceCall, handleVoiceHangup, voicePeer, localVoiceStream } = useSocket();
  return (
    <div>
     <ListOnlineUsers />
             <CallNotification />
             {/* <CallerNotification/> */}
            
                <CallScreen />
       
            <VideoCall />
    </div>
  );
}
