// import { io } from "../server.js";


// const onCall = async (participants, callType ) => {
//     console.log("Participants:", participants);
//     console.log("Receiver Socket ID:", participants.receiver.socketId);

//     if (participants.receiver.socketId) {
//         io.to(participants.receiver.socketId).emit('incomingCall', participants, callType);
//     } else {
//         console.log("Receiver has no socket ID or is offline.");
//     }
// };
// export default onCall;

// socket.on('call', ({ participants, callType }) => {
//     receiverSocket.emit('incomingCall', {
//         participants,
//         callType
//     });
// });


import { io } from "../server.js";

const onCall = async (data) => {
    console.log("Data received:", data);

    // Destructure the nested participants and callType
    const { participants, callType } = data;

    // Check if participants and receiver exist
    if (!participants || !participants.receiver) {
        console.log("Invalid participants data or missing receiver.");
        return;
    }

    console.log("Receiver Socket ID:", participants.receiver.socketId);

    // Check if the receiver has a socket ID
    if (participants.receiver.socketId) {
        // Emit the incoming call event with both participants and callType
        io.to(participants.receiver.socketId).emit('incomingCall', {
            participants,
            callType // Include the call type in the emitted data
        });
    } else {
        console.log("Receiver has no socket ID or is offline.");
    }
};

export default onCall;