import { io } from "../server.js";

// const onVoiceHangup = async (data) => {
//     if (!data?.ongoingCall || !data?.ongoingCall?.participants) {
//         console.error("❌ Error: Missing or invalid ongoing call data.", data);
//         return;
//     }

//     const { participants } = data.ongoingCall;

//     if (!participants?.caller || !participants?.receiver) {
//         console.error("❌ Error: Missing caller or receiver in participants", participants);
//         return;
//     }

//     // Determine target based on who is hanging up
//     const target =
//         participants.caller.userId === data.userHangingupId
            //? participants.receiver?.socketId
            // : participants.caller?.socketId;

//     if (target) {
//         io.to(target).emit("voiceHangup");
//         console.log(`✅ Voice hangup emitted to socketId: ${target}`);
//     } else {
//         console.error("❌ Error: Target socketId is missing", target);
//     }
// };

// export default onVoiceHangup;
const onVoiceHangup = async (data) => {
    let socketIdToEmitTo;

    if (data?.ongoingCall.participants.caller.userId === data?.userHangingupId) {
        socketIdToEmitTo = data?.ongoingCall.participants.receiver.socketId;
    } else {
        socketIdToEmitTo = data?.ongoingCall.participants.caller.socketId;
    }

    if (socketIdToEmitTo) {
        io.to(socketIdToEmitTo).emit("voiceHangup");
    }
};

export default onVoiceHangup;
