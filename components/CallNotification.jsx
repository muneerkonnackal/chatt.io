"use client"
import { useSocket } from "@/context/SocketContext"
import Avatar from "./Avatar";
import { MdCall, MdCallEnd } from "react-icons/md";

const CallNotification = () => {
    const { ongoingCall, handleJoinCall, handleHangup, handleJoinVoiceCall } = useSocket();
    console.log("data from ongoingCall notification>>>", ongoingCall);

    
    const handleAnswer = () => {
        if (!ongoingCall) return;
        
        if (ongoingCall.callType === 'voice') {
            handleJoinVoiceCall(ongoingCall);
        } else {
            handleJoinCall(ongoingCall);
        }
    };
    

    if(!ongoingCall?.isRinging) return;

    return (
        <div className="absolute bg-slate-500 bg-opacity-70 w-screen top-0 bottom-0 flex items-center justify-center">
            <div className="bg-white min-w-[300px] min-h-[100px] flex flex-col items-center justify-center rounded p-4">
                {/* <div className="flex flex-col items-center">
                    <Avatar src={ongoingCall.participants.caller.profile.imageUrl} />
                    <h3>{ongoingCall.participants.caller.profile.fullName?.split(' ')[0]}</h3>
                </div> */}

            <div className="flex flex-col items-center">
                <Avatar src={ongoingCall.participants?.caller?.profile.imageUrl}/>
                <h3>{ongoingCall.participants?.caller?.profile.fullName?.split(' ')[0]}</h3>
            </div>
                
                {/* ✅ Fix: Correct JSX syntax for displaying call type */}
                <p className="text-sm mb-2">
                    {ongoingCall?.callType === 'voice' 
                        ? 'Incoming Voice Call' 
                        : 'Incoming Video Call'}
                </p>

                <div className="flex gap-8">
                    <button 
                         onClick={handleAnswer} 
                        className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <MdCall size={24} />
                    </button>

                    <button 
                        onClick={()=> handleHangup({ongoingCall})}
                        className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white">
                        <MdCallEnd size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallNotification;
