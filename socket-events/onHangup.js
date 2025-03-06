// import { io } from "../server.js";

// const onHangup = async (data) => {
//     let socketIdToEmitTo;

//     if(data?.ongoingCall.participants.caller.userId === data?.userHangingupId){
//         socketIdToEmitTo = data?.ongoingCall.participants.receiver.socketId
//     } else {
//         socketIdToEmitTo = data?.ongoingCall.participants.caller.socketId
//     }

//     if(socketIdToEmitTo){
//         io.to(socketIdToEmitTo).emit('hangup')
//     }

// }

// export default onHangup

import { io } from "../server.js";

const onHangup = async (data) => {
    let socketIdToEmitTo;

    if(data?.ongoingCall.participants.caller.userId === data?.userHangingupId){
        socketIdToEmitTo = data?.ongoingCall.participants.receiver.socketId
    } else {
        socketIdToEmitTo = data?.ongoingCall.participants.caller.socketId
    }

    if(socketIdToEmitTo){
        io.to(socketIdToEmitTo).emit('hangup')
    }

}

export default onHangup

// import { io } from "../server.js";

// const onHangup = async (data) => {
//     console.log("Hangup data received:", data);

//     let socketIdToEmitTo;
//     if (data?.ongoingCall.participants.caller.userId === data.userHangingupId) {
//         socketIdToEmitTo = data?.ongoingCall.participants.receiver.socketId;
//     } else {
//         socketIdToEmitTo = data?.ongoingCall.participants.caller.socketId;
//     }

//     if (socketIdToEmitTo) {
//         io.to(socketIdToEmitTo).emit('hangup');
//     }
// };

// export default onHangup;

// import { io } from "../server.js";

// const onHangup = async (data) => {
//     console.log("Hangup data received:", data);

//     let socketIdToEmitTo;
//     if (data?.ongoingCall?.participants?.caller?.userId === data?.userHangingupId) {
//         socketIdToEmitTo = data?.ongoingCall?.participants?.receiver?.socketId;
//     } else {
//         socketIdToEmitTo = data?.ongoingCall?.participants?.caller?.socketId;
//     }

//     if (socketIdToEmitTo) {
//         io.to(socketIdToEmitTo).emit('hangup');
//     }
// };

// export default onHangup;

// import { io } from "../server.js";

// const onHangup = async (data) => {
//     if (!data || !data.ongoingCall || !data.ongoingCall.participants) {
//         console.error("Invalid data received:", data);
//         return;
//     }

//     console.log("Hangup data received:", data);

//     const { caller, receiver } = data.ongoingCall.participants;

//     if (!caller || !receiver) {
//         console.error("Invalid participants data received:", data.ongoingCall.participants);
//         return;
//     }

//     const callerSocketId = caller.socketId;
//     const receiverSocketId = receiver.socketId;

//     if (callerSocketId) {
//         io.to(callerSocketId).emit('hangup');
//     }

//     if (receiverSocketId) {
//         io.to(receiverSocketId).emit('hangup');
//     }

//     console.log("Hangup event emitted to both participants");
// };

// export default onHangup;
// socket.on('rejectCall',(data, receiverId) => {
//     console.log(`${data.from} rejected the call`);
//     io.to(receiverId).emit('callRejected')
// })
