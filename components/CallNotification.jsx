// "use client"
// import { useSocket } from "@/context/SocketContext"
// import Avatar from "./Avatar";
// import { MdCall, MdCallEnd } from "react-icons/md";

// const CallNotification = () => {
//     const {ongoingCall, handleJoinCall, handleHangup} = useSocket()

//     if(!ongoingCall?.isRinging) return;
//   return (
//     <div className="absolute bg-slate-500 bg-opacity-70 w-screen top-0 bottom-0 flex items-center justify-center">
//         <div className="bg-white min-w-[300px] min-h-[100px] flex flex-col items-center justify-center rounded p-4">
//             <div className="flex flex-col items-center">
//                 <Avatar src={ongoingCall.participants.caller.profile.imageUrl}/>
//                 <h3>{ongoingCall.participants.caller.profile.fullName?.split(' ')[0]}</h3>
//             </div>
//             <p className="text-sm mb-2">Incoming Call</p>
//             <div className="flex gap-8">
//                 <button onClick={() => handleJoinCall(ongoingCall)} className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white"><MdCall size={24} /></button>
//                 <button onClick={()=> handleHangup({ongoingCall})} className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white"><MdCallEnd size={24} /></button>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default CallNotification

"use client";
import { useSocket } from "@/context/SocketContext";
import Avatar from "./Avatar";
import { MdCall, MdCallEnd } from "react-icons/md";

const CallNotification = () => {
    const {
        ongoingCall,           // For video calls
        ongoingVoiceCall,      // For voice calls
        handleJoinCall,        // Video call join
        handleJoinVoiceCall,   // Voice call join
        handleHangup,          // Video call hangup
        handleVoiceHangup      // Voice call hangup
    } = useSocket();

    // Determine the type of call
    const call = ongoingCall?.isRinging ? ongoingCall : ongoingVoiceCall?.isRinging ? ongoingVoiceCall : null;
    const isVoiceCall = call === ongoingVoiceCall;

    console.log('caallll', call);
    console.log('ongoingCall', ongoingVoiceCall);
    
    

    if (!call) return null; // Don't render if no call is ongoing

    const callerProfile = call.participants?.caller?.profile;
    console.log('callproffff', callerProfile);
    

    return (
        <div className="absolute bg-slate-500 bg-opacity-70 w-screen top-0 bottom-0 flex items-center justify-center">
            <div className="bg-white min-w-[300px] min-h-[100px] flex flex-col items-center justify-center rounded p-4">
                {!isVoiceCall ?
                    <div className="flex flex-col items-center">
                    <Avatar src={callerProfile?.imageUrl || "/default-avatar.png"} />
                    <h3>{callerProfile?.fullName?.split(" ")[0] || "Unknown Caller"}</h3>
                </div> :
                 <div className="flex flex-col items-center">
                     <Avatar src={call?.participants?.caller?.imageUrl || "/default-avatar.png"} />
                     <h3>{call?.participants?.caller?.fullName || "Unknown Caller"}</h3>
                 </div>
                }
                <p className="text-sm mb-2">
                    Incoming {isVoiceCall ? "Voice Call" : "Video Call"}
                </p>
                <div className="flex gap-8">
                    <button
                        onClick={() =>
                            isVoiceCall ? handleJoinVoiceCall(call) : handleJoinCall(call)
                        }
                        className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white"
                    >
                        <MdCall size={24} />
                    </button>
                    <button
                        onClick={() =>
                            isVoiceCall ? handleVoiceHangup({ ongoingVoiceCall: call }) : handleHangup({ ongoingCall: call })
                        }
                        className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white"
                    >
                        <MdCallEnd size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallNotification;

