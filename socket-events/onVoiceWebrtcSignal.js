// import { io } from "../server.js";

// const onVoiceWebrtcSignal = async (data) => {
//     if (data.isCaller) {
//         if (data.ongoingCall.participants.receiver.socketId) {
//             io.to(data.ongoingCall.participants.receiver.socketId).emit(
//                 "voiceWebrtcSignal",
//                 data
//             );
//         }
//     } else {
//         if (data.ongoingCall.participants.caller.socketId) {
//             io.to(data.ongoingCall.participants.caller.socketId).emit(
//                 "voiceWebrtcSignal",
//                 data
//             );
//         }
//     }
// };

// export default onVoiceWebrtcSignal;
import { io } from "../server.js";

const onWebrtcSignal = async (data) => {
  // Ensure ongoingCall and participants exist
  if (!data?.ongoingCall || !data.ongoingCall.participants) {
    console.error("Invalid webrtcSignal data:", data);
    return;
  }

  // Depending on whether the sender is the caller or not, determine the target.
  if (data.isCaller) {
    // If the caller is sending the signal, forward it to the receiver.
    const receiverSocketId = data.ongoingCall.participants.receiver?.socketId;
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("webrtcSignal", data);
    } else {
      console.error("Receiver socketId not found in webrtcSignal data:", data);
    }
  } else {
    // Otherwise, the receiver is sending the signal; forward it to the caller.
    const callerSocketId = data.ongoingCall.participants.caller?.socketId;
    if (callerSocketId) {
      io.to(callerSocketId).emit("webrtcSignal", data);
    } else {
      console.error("Caller socketId not found in webrtcSignal data:", data);
    }
  }
};

export default onWebrtcSignal;
