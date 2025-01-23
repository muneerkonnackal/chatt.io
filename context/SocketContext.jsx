

//[] cor 4
"use client"
import {  useUser } from "@clerk/nextjs";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const { user, isLoaded } = useUser();
    const [socket, setSocket] = useState(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [ongoingCall, setOngoingCall] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [peer, setPeer] = useState();
    const [isCallEnded, setIsCallEnded] = useState(false);
    const [isAdmin, setIsAdmin] = useState("")
    // const [remoteDescriptionQueue, setRemoteDescriptionQueue] = useState( null);
    const [ongoingVoiceCall, setOngoingVoiceCall] = useState(null);
    const [localVoiceStream, setLocalVoiceStream] = useState(null);
    const [voicePeer, setVoicePeer] = useState();
    const [voiceCallEnded,setVoiceCallEnded] = useState(false)

    const ADMIN_EMAIL = "muneer@steyp.com"; // Define the admin email
   
    useEffect(() => {
        if (isLoaded && user) {
            console.log('User loaded:', user);
            console.log('User email:', user.emailAddresses ? user.emailAddresses[0].emailAddress : 'No email found');
            const userEmail = user.emailAddresses ? user.emailAddresses[0].emailAddress : null;
            setIsAdmin(userEmail)
        } else {
            console.log('User not loaded or not authenticated');
        }
    }, [user, isLoaded]);
    console.log('isAdmin', isAdmin);
    

    const currentSocketUser = onlineUsers?.find(onlineUser => onlineUser.userId === user?.id);

    useEffect(() => {
        if (!socket || !isSocketConnected) return;

        socket.on("incomingVoiceCall", onIncomingVoiceCall);
        socket.on("voiceWebrtcSignal", completeVoicePeerConnection);
        socket.on("voiceHangup", handleVoiceHangup);

        return () => {
            socket.off("incomingVoiceCall", onIncomingVoiceCall);
            socket.off("voiceWebrtcSignal", completeVoicePeerConnection);
            socket.off("voiceHangup", handleVoiceHangup);
        };
    }, [socket, isSocketConnected]);

    // const getVoiceStream = useCallback(async () => {
    //     if (localVoiceStream) return localVoiceStream;
    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //         setLocalVoiceStream(stream);
    //         return stream;
    //     } catch (error) {
    //         console.error("Failed to get audio stream", error);
    //         setLocalVoiceStream(null);
    //         return null;
    //     }
    // }, [localVoiceStream]);

    const getVoiceStream = useCallback(async () => {
        if (localVoiceStream) return localVoiceStream;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Audio stream initialized:", stream); // Debug log
            setLocalVoiceStream(stream);
            return stream;
        } catch (error) {
            console.error("Failed to get audio stream", error);
            setLocalVoiceStream(null);
            return null;
        }
    }, [localVoiceStream]);
    

    const handleVoiceCall = useCallback(async (user) => {
        if (isAdmin !== ADMIN_EMAIL) {
            console.log("Only admin can initiate a call.");
            return;
        }
        setVoiceCallEnded(false)
        if (!currentSocketUser || !socket) return;

        const stream = await getVoiceStream();
        if (!stream) {
            console.error("No audio stream available");
            return;
        }

        const participants = { caller: currentSocketUser, receiver: user };
        setOngoingVoiceCall({ 
            participants,
             isRinging: false });
        socket.emit("voiceCall", participants);
    }, [ socket, currentSocketUser, ongoingVoiceCall]);

    const handleVoiceHangup = useCallback(
        (data = {}) => {
            const { isEmitHangup = true, ongoingVoiceCall: hangupCall } = data;

            console.log('Hangup data:', data , 'socket:', socket);

            if (socket && user && isEmitHangup && hangupCall) {
                socket.emit("voiceHangup", { ongoingVoiceCall: hangupCall,
                    userHangingupId : user.id
                 });
            }

            // Clean up resources
            setOngoingVoiceCall(null);
            setVoicePeer(null);
            if (localVoiceStream) {
                localVoiceStream.getTracks().forEach((track) => track.stop());
                setLocalVoiceStream(null);
            }
            
            setVoiceCallEnded(true)
        },
        [ socket,user,localVoiceStream]
    );
    

    const createVoicePeer = useCallback((stream, initiator) => {
        const iceServers = [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                ],
            },
        ];

        const peer = new Peer({ stream, initiator, trickle: true, config: { iceServers } });

        peer.on("stream", (remoteStream) => {
            console.log("Received remote stream:", remoteStream);
            setVoicePeer((prev) => ({ ...prev, stream: remoteStream }));
        });
    

        peer.on("error", (error) => {
            console.error("Voice peer error:", error);
            handleVoiceHangup({ isEmitHangup: false });
        });

        peer.on("close", () => {
            console.log("Voice peer connection closed.");
            handleVoiceHangup({ isEmitHangup: false });
        });

        const rtcPeerConnection = peer._pc;
        rtcPeerConnection.oniceconnectionstatechange = async () => {
            console.log("ICE connection state:", rtcPeerConnection.iceConnectionState);
            if (
                rtcPeerConnection.iceConnectionState === "disconnected" ||
                rtcPeerConnection.iceConnectionState === "failed"
            ) {
                handleVoiceHangup({ isEmitHangup: false });
            }
        };
        console.log("Created voicepeer:", peer);
        return peer;
    }, [ongoingVoiceCall, setVoicePeer, handleVoiceHangup]);

    const completeVoicePeerConnection = useCallback(async (connectionData) => {
        if (!localVoiceStream) {
            console.log("Missing audio stream");
            return;
        }
        if (voicePeer) {
            console.log("Signaling existing peer connection");
            voicePeer.peerConnection?.signal(connectionData.sdp);
            return;
        }

        console.log("Creating new peer for voice connection");

        const newPeer = createVoicePeer(localVoiceStream, true);
        setVoicePeer({
            peerConnection: newPeer,
            participantUser: connectionData.ongoingVoiceCall.participants.receiver,
            stream: undefined,
        });

        newPeer.on("signal",async (data) => {
            if (socket) {
                socket.emit("voiceWebrtcSignal", { sdp: data, ongoingVoiceCall: connectionData.ongoingVoiceCall, isCaller: true });
            }
        });
    }, [localVoiceStream, createVoicePeer, voicePeer, ongoingVoiceCall]);


    const handleJoinVoiceCall = useCallback(async (ongoingVoiceCall) => {
        setVoiceCallEnded(false)
        setOngoingVoiceCall((prev) => (prev ? { ...prev, isRinging: false } : prev));

        const stream = await getVoiceStream();
        if (!stream) {
            console.log("Could not get audio stream");
            handleVoiceHangup({ ongoingVoiceCall });
            return;
        }

        const newPeer = createVoicePeer(stream, true);
        setVoicePeer({
            peerConnection: newPeer,
            participantUser: ongoingVoiceCall.participants.caller,
            stream: undefined,
        });

        newPeer.on("signal", async(data) => {
            if (socket) {
                socket.emit("voiceWebrtcSignal", { sdp: data, ongoingVoiceCall, isCaller: false });
            }
        });
    }, [ socket, currentSocketUser, getVoiceStream, createVoicePeer, handleVoiceHangup]);

    
    const onIncomingVoiceCall = useCallback((participants) => {
        setOngoingVoiceCall({ participants, isRinging: true });
    }, [socket, user, ongoingVoiceCall, handleJoinVoiceCall]);

    const getMediaStream = useCallback(async (faceMode) => {
        if (localStream) {
            return localStream;
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 360, ideal: 720, max: 1080 },
                    frameRate: { min: 16, ideal: 30, max: 30 },
                    facingMode: videoDevices.length > 0 ? faceMode : undefined
                }
            });
            setLocalStream(stream);
            return stream;

        } catch (error) {
            console.log('Failed to get the stream', error);
            setLocalStream(null);
            return null;
        }
    }, [localStream]);


    const handleCall = useCallback(async (user) => {
        if (isAdmin !== ADMIN_EMAIL) {
            console.log("Only admin can initiate a call.");
            return;
        }

        setIsCallEnded(false);
        if (!currentSocketUser || !socket) return;

        const stream = await getMediaStream();

        if (!stream) {
            console.log("No Stream in handleCall");
            return;
        }

        const participants = { caller: currentSocketUser, receiver: user };
        setOngoingCall({
            participants,
            isRinging: false
        });

        socket.emit('call', participants);
    }, [socket, currentSocketUser, ongoingCall]);

    const handleHangup = useCallback(
        (data = {}) => {
            const { isEmitHangup = true, ongoingCall: hangupCall } = data;

            if (socket && user && isEmitHangup && hangupCall) {
                socket.emit("hangup", {
                    ongoingCall: hangupCall,
                    userHangingupId: user.id,
                });
            }

            // Clean up local resources
            // socket.current.off("signal");
            setOngoingCall(null);
            setPeer(null);
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
                setLocalStream(null);
            }
            setIsCallEnded(true);
        },
        [socket, user, localStream]
    );

    const createPeer = useCallback((stream, initiator) => {
        const iceServers = [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                ],
            },
        ];

        const peer = new Peer({
            stream,
            initiator,
            trickle: true,
            config: { iceServers },
        });

        peer.on("stream", (remoteStream) => {
            setPeer((prevPeer) => {
                if (prevPeer) {
                    return { ...prevPeer, stream: remoteStream };
                }
                return null;
            });
            console.log("Received remote stream:", remoteStream);
        });

        peer.on("error", (error) => {
            console.error("Peer error:", error);
            handleHangup({ isEmitHangup: false });
        });

        peer.on("close", () => {
            console.log("Peer connection closed.");
            handleHangup({ isEmitHangup: false });
        });

        const rtcPeerConnection = peer._pc;
        console.log('peerpc', rtcPeerConnection);

        rtcPeerConnection.oniceconnectionstatechange = async () => {
            console.log("ICE connection state:", rtcPeerConnection.iceConnectionState);
            if (
                rtcPeerConnection.iceConnectionState === "disconnected" ||
                rtcPeerConnection.iceConnectionState === "failed"
            ) {
                handleHangup({ isEmitHangup: false });
            }
        };



        console.log("Created peer:", peer);

        return peer;
    }, [ongoingCall, setPeer, handleHangup, ]);

    const completePeerConnection = useCallback(async (connectionData) => {
        if (!localStream) {
            console.log("Missing the localStream");
            return;
        }
        if (peer) { 
            peer.peerConnection?.signal(connectionData.sdp);
            console.log('chec kingConnection data andd sdp:', connectionData.sdp);
            
            return;
        }

        
    

        const newPeer = createPeer(localStream, true);

        setPeer({
            peerConnection: newPeer,
            particpantUser: connectionData.ongoingCall.participants.receiver,
            stream: undefined
        });

        newPeer.on('signal', async (data) => {
            if (socket) {
                socket.emit('webrtcSignal', {
                    sdp: data,
                    ongoingCall: connectionData.ongoingCall,
                    isCaller: true
                });
            }
        });

    }, [localStream, createPeer, peer, ongoingCall]);

    

    const handleJoinCall = useCallback(async (ongoingCall) => {
        setIsCallEnded(false);
        setOngoingCall(prev => {
            if (prev) {
                return { ...prev, isRinging: false };
            }
            return prev;
        });

        const stream = await getMediaStream();
        if (!stream) {
            console.log('could not get stream in handle join Call');
            handleHangup({ ongoingCall });
            return;
        }

        const newPeer = createPeer(stream, true);

        setPeer({
            peerConnection: newPeer,
            particpantUser: ongoingCall.participants.caller,
            stream: undefined
        });

        newPeer.on('signal', async (data) => {
            if (socket) {
                socket.emit('webrtcSignal', {
                    sdp: data,
                    ongoingCall,
                    isCaller: false
                });
            }
        });
    }, [socket, currentSocketUser, getMediaStream, createPeer, handleHangup]);

    const onIncomingCall = useCallback((participants) => {
        setOngoingCall({
            participants,
            isRinging: true
        });

        // Auto-answer the call
        // handleJoinCall({ participants });
    }, [socket, user, ongoingCall, handleJoinCall]);

    useEffect(() => {
        const newSocket = io();
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        if (socket === null) return;

        function onConnect() {
            setIsSocketConnected(true);
        }

        function onDisconnect() {
            setIsSocketConnected(false);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, [socket]);

    useEffect(() => {
        if (!socket || !isSocketConnected) return;
        socket.emit('addNewUser', user);
        socket.on('getUsers', (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off('getUsers', (res) => {
                setOnlineUsers(res);
            });
        };

    }, [socket, isSocketConnected, user]);

    useEffect(() => {
        if (!socket || !isSocketConnected) return;

        socket.on("incomingCall", onIncomingCall);
        socket.on('webrtcSignal', completePeerConnection);
        socket.on('hangup', handleHangup);

        return () => {
            socket.off('incomingCall', onIncomingCall);
            socket.off('webrtcSignal', completePeerConnection);
            socket.off('hangup', handleHangup);

        };
    }, [socket, isSocketConnected, user, onIncomingCall, completePeerConnection]);

    useEffect(() => {
        let timeout;
        if (isCallEnded) {
            timeout = setTimeout(() => {
                setIsCallEnded(false);
            }, 2000);
        }
        return () => clearTimeout(timeout);
    }, [isCallEnded]);

    return <SocketContext.Provider value={{
        onlineUsers,
        handleCall,
        ongoingCall,
        peer,
        localStream,
        handleJoinCall,
        handleHangup,
        isCallEnded,
        onlineUsers,
         handleVoiceCall, // **Voice call function**
                handleJoinVoiceCall, // **Voice join call**
                handleVoiceHangup, // **Voice hangup**
                ongoingVoiceCall, // **Voice call state**
                localVoiceStream, // **Voice stream**
                voicePeer,
                voiceCallEnded
    }}>
        {children}
    </SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);

    if (context === null) {
        throw new Error("useSocket must be used within a SocketContextProvider");
    }

    return context;
};