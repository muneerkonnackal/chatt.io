"use client"
import { useSocket } from "@/context/SocketContext"
import { useUser } from "@clerk/nextjs"
import Avatar from "./Avatar"
import { IoVideocamOutline } from "react-icons/io5";
import { BiPhoneCall } from "react-icons/bi";


const ListOnlineUsers = () => {
    const {user} = useUser()
    const {onlineUsers, handleCall, handleVoiceCall} = useSocket()
  

  return (
    <div className="flex gap-4  border-b-primary/10 w-full items-center pb-2 ml-10 ">
        {onlineUsers && onlineUsers.map(onlineUser => {

            if(onlineUser.profile.id === user?.id) return null

            return <div key={onlineUser.userId}  className="flex flex-col items-center gap-1 cursor-pointer border-2 border-black shadow-lg p-2 rounded-lg">
                <Avatar src={onlineUser.profile.imageUrl} />
                <div className="text-sm">{onlineUser.profile.fullName?.split(' ')[0]}</div>
                <div className="flex gap- ">
                   <button className="rounded-full hover:border hover:bg-green-300 px-2 py-2"  onClick={() => handleCall(onlineUser)}><IoVideocamOutline   size={30}  /></button>
                   <button className="rounded-full hover:border hover:bg-green-300 px-2 py-2" onClick={() => handleVoiceCall(onlineUser)}><BiPhoneCall size={30} /></button>
                </div>
            </div>

           
        }) }
    </div>
  )
}

export default ListOnlineUsers