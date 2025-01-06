import { io } from "../server.js";

// const onCall = async(participants) => {
//     if(participants.receiver.socketId){
//         io.to(participants.receiver.socketid).emit('incomingCall', participants)
//     }
// }
// export default onCall;

const onCall = async (participants) => {
    console.log("Participants:", participants);
    console.log("Receiver Socket ID:", participants.receiver.socketId);

    if (participants.receiver.socketId) {
        io.to(participants.receiver.socketId).emit('incomingCall', participants);
    } else {
        console.log("Receiver has no socket ID or is offline.");
    }
};
export default onCall;
