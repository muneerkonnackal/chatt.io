import { io } from "../server.js";

const onVoiceHangup = (data) => {
//   const { ongoingVoiceCall } = data;
let socketIdToEmitTo;
if(data?.ongoingVoiceCall.participants.caller.userId === data?.userHangingId){
    socketIdToEmitTo = data?.ongoingVoiceCall.participants.receiver.socketId
} else {
    socketIdToEmitTo = data?.ongoingVoiceCall.participants.caller.socketId
}

if(socketIdToEmitTo){
    io.to(socketIdToEmitTo).emit("voiceHangup")
}
}

//   if (!ongoingVoiceCall || !ongoingVoiceCall.participants) {
//     console.error("Invalid ongoingVoiceCall data received.");
//     return;
//   }

//   // Notify the caller
//   if (ongoingVoiceCall.participants.caller?.socketId) {
//     io.to(ongoingVoiceCall.participants.caller.socketId).emit("voiceHangup", data);
//   }

//   // Notify the receiver
//   if (ongoingVoiceCall.participants.receiver?.socketId) {
//     io.to(ongoingVoiceCall.participants.receiver.socketId).emit("voiceHangup", data);
//   }
// };

export default onVoiceHangup;
