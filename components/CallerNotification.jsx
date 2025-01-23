"use client";
import { useSocket } from "@/context/SocketContext";
import Avatar from "./Avatar";
import { MdCallEnd } from "react-icons/md";

const CallerNotification = () => {
    const { callerNotification, handleCancelCall, } = useSocket();

    if (!callerNotification) return null;

    const { participants, callType } = callerNotification;

    return (
        <div className="absolute bg-slate-500 bg-opacity-70 w-screen top-0 bottom-0 flex items-center justify-center">
            <div className="bg-white min-w-[300px] min-h-[100px] flex flex-col items-center justify-center rounded p-4">
                <div className="flex flex-col items-center">
                    <Avatar src={participants.receiver.profile.imageUrl} />
                    <h3>{participants.receiver.profile.fullName?.split(" ")[0]}</h3>
                </div>
                <p className="text-sm mb-2">
                    {callType === "video" ? "Calling Video..." : "Calling Voice..."}
                </p>
                <button
                    onClick={handleCancelCall}
                    className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white"
                >
                    <MdCallEnd size={24} />
                </button>
            </div>
        </div>
    );
};

export default CallerNotification;
