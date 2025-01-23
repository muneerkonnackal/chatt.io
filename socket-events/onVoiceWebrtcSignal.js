import { io } from "../server.js";


const onVoiceWebrtcSignal = async (data) => {
    if (data.isCaller) {
        if (data.ongoingVoiceCall.participants.receiver.socketId) {
            io.to(data.ongoingVoiceCall.participants.receiver.socketId).emit(
                "voiceWebrtcSignal",
                data
            );
        }
    } else {
        if (data.ongoingVoiceCall.participants.caller.socketId) {
            io.to(data.ongoingVoiceCall.participants.caller.socketId).emit(
                "voiceWebrtcSignal",
                data
            );
        }
    }
};

// const onVoiceWebrtcSignal = async (data) => {
//     try {
//         if (data.isCaller) {
//             const receiverSocket = data.ongoingVoiceCall?.participants?.receiver?.socketId;
//             if (receiverSocket) {
//                 io.to(receiverSocket).emit("voiceWebrtcSignal", data);
//             } else {
//                 console.error("Receiver socket ID missing", data.ongoingVoiceCall?.participants?.receiver);
//             }
//         } else {
//             const callerSocket = data.ongoingVoiceCall?.participants?.caller?.socketId;
//             if (callerSocket) {
//                 io.to(callerSocket).emit("voiceWebrtcSignal", data);
//             } else {
//                 console.error("Caller socket ID missing", data.ongoingVoiceCall?.participants?.caller);
//             }
//         }
//     } catch (err) {
//         console.error("Error handling WebRTC signal:", err);
//     }
// };

// const onVoiceWebrtcSignal = async (data) => {
//     try {
//       if (data.isCaller) {
//         const receiverSocket = data.ongoingVoiceCall?.participants?.receiver?.socketId;
//         if (receiverSocket) {
//           io.to(receiverSocket).emit("voiceWebrtcSignal", data);
//         } else {
//           console.error("Receiver socket ID missing", data.ongoingVoiceCall?.participants?.receiver);
//         }
//       } else {
//         const callerSocket = data.ongoingVoiceCall?.participants?.caller?.socketId;
//         if (callerSocket) {
//           io.to(callerSocket).emit("voiceWebrtcSignal", data);
//         } else {
//           console.error("Caller socket ID missing", data.ongoingVoiceCall?.participants?.caller);
//         }
//       }
//     } catch (err) {
//       console.error("Error handling WebRTC signal:", err);
//     }
//   };
export default onVoiceWebrtcSignal
