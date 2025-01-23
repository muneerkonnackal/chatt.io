import { io } from "../server.js";


const onVoiceCall =async (participants) => {
    console.log("Participants:", participants);
    console.log("Receiver Socket ID:", participants.receiver.socketId);

    if (participants.receiver.socketId) {
        io.to(participants.receiver.socketId).emit('incomingVoiceCall', participants);
    } else {
        console.log("Receiver has no socket ID or is offline.");
    }
};

export default onVoiceCall;
