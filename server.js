import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import onCall from "./socket-events/onCall.js";
import onWebrtcSignal from "./socket-events/onWebrtcSignal.js";
import onHangup from "./socket-events/onHangup.js";
import onVoiceCall from "./socket-events/onVoiceCall.js";
import onVoiceWebrtcSignal from "./socket-events/onVoiceWebrtcSignal.js";
import onVoiceHangup from "./socket-events/onVoiceHangup.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

console.log("Running...>>");

export let io;

app.prepare().then(() => {
  const httpServer = createServer(handler);

  io = new Server(httpServer);
  let onlineUsers = [];

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Add user to online users
    // socket.on("addNewUser", (clerkUser) => {
    //     console.log("Adding user to onlineUsers:", clerkUser);
    
    //     if (!clerkUser || !clerkUser.id) {
    //         console.log("Invalid user data received.");
    //         return;
    //     }
    
    //     // Check if user is already in the list
    //     const existingUser = onlineUsers.find((user) => user.userId === clerkUser.id);
    //     if (!existingUser) {
    //         onlineUsers.push({
    //             userId: clerkUser.id,
    //             socketId: socket.id, // Store correct socket ID
    //             profile: clerkUser,
    //         });
    //     } else {
    //         existingUser.socketId = socket.id; // Update socket ID if user reconnects
    //     }
    
    //     console.log("Current onlineUsers:", onlineUsers);
    //     io.emit("getUsers", onlineUsers); // Broadcast updated user list
    // });

    socket.on("addNewUser", (clerkUser) => {
        console.log("Adding user to onlineUsers:", clerkUser);
    
        if (!clerkUser || !clerkUser.id) {
            console.log("Invalid user data received.");
            return;
        }
    
        // Check if user is already in the list
        const existingUser = onlineUsers.find((user) => user.userId === clerkUser.id);
        if (!existingUser) {
            onlineUsers.push({
                userId: clerkUser.id,
                socketId: socket.id, // Store correct socket ID
                profile: clerkUser,
            });
        } else {
            existingUser.socketId = socket.id; // Update socket ID if user reconnects
        }
    
        console.log("Current onlineUsers:", onlineUsers);
        io.emit("getUsers", onlineUsers); // Broadcast updated user list
    });
    

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

      console.log("Updated onlineUsers after disconnect:", onlineUsers);

      io.emit("getUsers", onlineUsers); // Broadcast updated user list
    });

    // Video call events
    socket.on("call", onCall);
    socket.on("webrtcSignal", onWebrtcSignal);
    socket.on("hangup", onHangup);

    // Voice call events
    socket.on("voiceCall", onVoiceCall);
    socket.on("voiceWebrtcSignal", onVoiceWebrtcSignal);
    socket.on("voiceHangup", onVoiceHangup);
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});