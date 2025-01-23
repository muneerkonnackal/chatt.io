// "use client"
// import { useSocket } from "@/context/SocketContext"
// import { useUser } from "@clerk/nextjs"
// import Avatar from "./Avatar"


// const ListOnlineUsers = () => {
//     const {user} = useUser()
//     const {onlineUsers, handleCall} = useSocket()


//   return (
//     <div className="flex gap-4 border-b-primary/10 w-full items-center pb-2">
//         {onlineUsers && onlineUsers.map(onlineUser => {

//             if(onlineUser.profile.id === user?.id) return null

//             return <div key={onlineUser.userId} onClick={() => handleCall(onlineUser)} className="flex flex-col items-center gap-1 cursor-pointer">
//                 <Avatar src={onlineUser.profile.imageUrl} />
//                 <div className="text-sm">{onlineUser.profile.fullName?.split(' ')[0]}</div>
//             </div>
//         }) }
//     </div>
//   )
// }

// export default ListOnlineUsers

"use client";
import { useSocket } from "@/context/SocketContext";
import { useUser } from "@clerk/nextjs";
import Avatar from "./Avatar";

const ListOnlineUsers = () => {
    const { user } = useUser();
    const { onlineUsers, handleCall, handleVoiceCall } = useSocket(); // Import both functions

    return (
        <div className="flex gap-4 border-b-primary/10 w-full items-center pb-2">
            {onlineUsers &&
                onlineUsers.map((onlineUser) => {
                    if (onlineUser.profile.id === user?.id) return null; // Skip the current user

                    return (
                        <div
                            key={onlineUser.userId}
                            className="flex flex-col items-center gap-1 cursor-pointer"
                        >
                            <Avatar src={onlineUser.profile.imageUrl} />
                            <div className="text-sm">{onlineUser.profile.fullName?.split(" ")[0]}</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleCall(onlineUser)} // Video call
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Video Call
                                </button>
                                <button
                                    onClick={() => handleVoiceCall(onlineUser)} // Voice call
                                    className="text-green-500 hover:text-green-700"
                                >
                                    Voice Call
                                </button>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default ListOnlineUsers;
