

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

    const getVoiceStream = useCallback(async (faceMode) => {
        if (localStream) {
            return localStream;
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            // const videoDevices = devices.filter(device => device.kind === 'videoinput');

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video:false
                // video: {
                //     width: { min: 640, ideal: 1280, max: 1920 },
                //     height: { min: 360, ideal: 720, max: 1080 },
                //     frameRate: { min: 16, ideal: 30, max: 30 },
                //     facingMode: videoDevices.length > 0 ? faceMode : undefined
                // }
            });
            setLocalStream(stream);
            return stream;

        } catch (error) {
            console.log('Failed to get the stream', error);
            setLocalStream(null);
            return null;
        }
    }, [localStream]);

    const handleVoiceCall = useCallback(async (user) => {
        if (isAdmin !== ADMIN_EMAIL) {
            console.log("Only admin can initiate a call.");
            return;
        }

        setIsCallEnded(false);
        if (!currentSocketUser || !socket) return;

        const stream = await getVoiceStream();

        if (!stream) {
            console.log("No Stream in handleCall");
            return;
        }

        const participants = { caller: currentSocketUser, receiver: user };
        // setOngoingCall({
        //     participants,
        //     isRinging: false
        // });

        // socket.emit('call', participants);
        setOngoingCall({
            participants,
            isRinging: false,
            callType: 'voice'  // Add call type
        });
        socket.emit('call', { participants, callType: 'voice' });
    }, [socket, currentSocketUser, ongoingCall]);


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
        // setOngoingCall({
        //     participants,
        //     isRinging: false
        // });

        // socket.emit('call', participants);
        setOngoingCall({
            participants,
            isRinging: false,
            callType: 'video'  // Add call type
        });
        socket.emit('call', { participants, callType: 'video' });
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
            console.log('checkingConnection data andd sdp:', connectionData.sdp);
            
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

    const handleJoinVoiceCall = useCallback(async (ongoingCall) => {
        setIsCallEnded(false);
        setOngoingCall(prev => {
            if (prev) {
                return { ...prev, isRinging: false };
            }
            return prev;
        });

        const stream = await getVoiceStream()
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
    }, [socket, currentSocketUser, getVoiceStream, createPeer, handleHangup]);
    

    const handleJoinCall = useCallback(async (ongoingCall) => {
        setIsCallEnded(false);
        setOngoingCall(prev => {
            if (prev) {
                return { ...prev, isRinging: false };
            }
            return prev;
        });

        const stream = await getMediaStream()
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

    const onIncomingCall = useCallback((data) => {
        // setOngoingCall({
        //     participants,
        //     isRinging: true
        // });

        setOngoingCall({
            participants: data.participants,
            isRinging: true,
            callType: data.callType  // Add call type from server
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
        handleVoiceCall,
        handleJoinVoiceCall,
        ongoingCall,
        peer,
        localStream,
        setLocalStream,
        handleJoinCall,
        handleHangup,
        isCallEnded,
        onlineUsers,
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