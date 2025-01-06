import { useUser } from "@clerk/nextjs";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer,{SignalData} from "simple-peer"

export const SocketContext = createContext()

export const SocketContextProvider = ({children}) => {
    const {user} = useUser()
    const [socket, setSocket] = useState(null)
    const [isSocketConnected, setIsSocketConnected] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [ongoingCall, setOngoingCall] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [peer, setPeer] = useState(null);
    const [isCallEnded, setIsCallEnded] = useState(false)

    // console.log("useUser Clerk data", useUser);
    
    // console.log('isConnected...>>', isSocketConnected);
    console.log('locstream>>', localStream);
    
    const currentSocketUser = onlineUsers?.find(onlineUser => onlineUser.userId === user?.id )

    const getMediaStream = useCallback(async(faceMode) => {
        if(localStream){
            return localStream
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices()
            const videoDevices = devices.filter(device => device.kind === 'videoinput')
            console.log('inside stream');
            
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video:{
                    width:{min: 640, ideal: 1280, max: 1920},
                    height: {min: 360, ideal: 720, max: 1080},
                    frameRate: {min: 16, ideal: 30, max:30},
                    facingMode: videoDevices.length>0 ? faceMode : undefined
                }
            })
            setLocalStream(stream)
            return stream
            
        } catch (error) {
            console.log('Failed to get the stream', error);
            setLocalStream(null)
            return null
        }
    },[localStream])

    //* call function
    const handleCall = useCallback(async(user) =>{
        setIsCallEnded(false)
        if(!currentSocketUser || !socket) return;

        const stream = await getMediaStream()
        console.log('stream video');
        

        if(!stream){
            console.log("No Stream in handleCall");
            return;
        }

        const participants = {caller: currentSocketUser, receiver: user}
        setOngoingCall({
            participants,
            isRinging: false
        })
        socket.emit('call', participants)
    },[socket, currentSocketUser, ongoingCall])
    

    const onIncomingCall = useCallback((participants) => {
        
        setOngoingCall({
            participants,
            isRinging: true
        })
    },[socket, user, ongoingCall])

    // * hangUp
    // const handleHangup = useCallback((data)=>{
    //     console.log('data',data);
        
    //     if(socket && user && data?.ongoingCall && data?.isEmitHangup){
    //         console.log('isemitHangup',isEmitHangup, data );
            
    //         socket.emit('hangup', {
    //             ongoingCall: data.ongoingCall,
    //             userHangingupId: user.id
    //         })
    //     }

    //     setOngoingCall(null)
    //     setPeer(null)
    //     if(localStream){
    //         localStream.getTracks().forEach((track) => track.stop())
    //         setLocalStream(null)
    //     }
    //     setIsCallEnded(true)
    // },[socket, user, localStream])

    const handleHangup = useCallback(
        (data = {}) => {
            console.log("Handle hangup data:", data);
    
            const { isEmitHangup = true, ongoingCall: hangupCall } = data;
    
            if (socket && user && isEmitHangup && hangupCall) {
                socket.emit("hangup", {
                    ongoingCall: hangupCall,
                    userHangingupId: user.id,
                });
            }
    
            // Clean up local resources
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
    


// const handleHangup = useCallback((data) => {
//     if (socket && user && data?.ongoingCall && data?.isEmitHangup) {
//         socket.emit('hangup', {
//             ongoingCall: data.ongoingCall,
//             userHangingupId: user.id
//         });
//     }
//     setOngoingCall(null);
//     setPeer(null);
//     if (localStream) {
//         localStream.getTracks().forEach((track) => track.stop());
//         setLocalStream(null);
//     }
//     setIsCallEnded(true);
// }, [socket, user, localStream]);

// useEffect(() => {
//     if (socket) {
//         socket.on('hangup', () => {
//             setOngoingCall(null);
//             setPeer(null);
//             if (localStream) {
//                 localStream.getTracks().forEach((track) => track.stop());
//                 setLocalStream(null);
//             }
//             setIsCallEnded(true);
//         });
//     }
// }, [socket, localStream]);

// ... other code

    //* peerconnection
    // const createPeer = useCallback((stream, initiator) => {
    //     const iceServers = [
    //         {
    //             urls: [
    //                 "stun:stun.l.google.com:19302",
    //                 "stun:stun1.l.google.com:19302",
    //                 "stun:stun2.l.google.com:19302",
    //                 "stun:stun3.l.google.com:19302",
    //             ]
    //         }
    //     ]

    //     const peer = new Peer({
    //         stream,
    //         initiator,
    //         trickle: true,
    //         config:{iceServers}
    //     })

    //     peer.on('stream',(stream) => {
    //         setPeer((prevPeer) => {
    //             if(prevPeer) {
    //                 return {...prevPeer, stream}
                    
    //             }
    //             return prevPeer
                
                
    //         })
    //         console.log('stream>>>', stream);
            
    //     });
    //     peer.on('error', console.error)
    //     peer.on('close', () => handleHangup())

    //     const rtcPeerConnection = peer._pc
    //     rtcPeerConnection.oniceconnectionstatechange = async() =>{
    //         if(rtcPeerConnection.iceConnectionState === 'disconnected' || rtcPeerConnection.iceConnectionState === 'failed'){
    //             handleHangup()
    //         }
    //     }
    //     console.log('peeeer>>>>',peer);

    //     return peer
        
    // },[ongoingCall, setPeer])
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
    }, [handleHangup]);
    



//* complete peer connection
    const completePeerConnection = useCallback(async(connectionData) => {
        // const { sdp, ongoingCall, isCaller } = connectionData;
        console.log('connectionData', connectionData);
        if(!localStream) {
            console.log("Missing the localStream");
            return;
        }
        if(peer){
            peer.peerConnection?.signal(connectionData.sdp)
            return
        }

        const newPeer = createPeer(localStream, true)
        
        setPeer({
            peerConnection: newPeer,
            particpantUser: connectionData.ongoingCall.participants.receiver,
            stream: undefined
        })

        newPeer.on('signal', async(data) =>{
            //data coming from simple peer library
            if(socket){
                //* emit offer
                socket.emit('webrtcSignal', {
                    sdp: data,
                    ongoingCall,
                    isCaller: true
                })
            }
        })

    },[localStream, createPeer, peer, ongoingCall])

    const handleJoinCall = useCallback(async(ongoingCall)=>{
        setIsCallEnded(false)
        //* join call
        setOngoingCall(prev => {
            if(prev){
                return {...prev, isRinging:false}
            }
            return prev 
        })

        const stream = await getMediaStream()
            if(!stream){
                console.log('could not get stream in handle join Call');
                handleHangup({ongoingCall})
                return 
            }
        console.log('ongoingCall',ongoingCall);

        //* peer connection
        const newPeer = createPeer(stream, true)
        
        setPeer({
            peerConnection: newPeer,
            particpantUser: ongoingCall.participants.caller,
            stream: undefined
        })

        newPeer.on('signal', async(data) =>{
            //data coming from simple peer library
            if(socket){
                //* emit offer
                socket.emit('webrtcSignal', {
                    sdp: data,
                    ongoingCall,
                    isCaller: false
                })
            }
        })
    },[socket, currentSocketUser])

    

    //* initializing socket
    useEffect(()=>{
       const newSocket = io()
       setSocket(newSocket) 

       return () => {
        newSocket.disconnect()
       }
    },[user])

    
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

    // set online users
    useEffect(()=>{
        if(!socket || !isSocketConnected) return;
        socket.emit('addNewUser', user)
        socket.on('getUsers', (res) =>{
            setOnlineUsers(res)
        })

        return ()=> {
            socket.off('getUsers', (res) =>{
                setOnlineUsers(res)
            })
        }

    },[socket, isSocketConnected, user])
    
    //*Call events
    useEffect(()=>{
        if(!socket || !isSocketConnected) return;

        socket.on("incomingCall", onIncomingCall);
        socket.on('webrtcSignal', completePeerConnection)
        socket.on('hangup',handleHangup)

        return ()=> {
            socket.off('incomingCall', onIncomingCall)
            socket.off('webrtcSignal', completePeerConnection)
            socket.off('hangup',handleHangup)

        }
    },[socket, isSocketConnected, user, onIncomingCall, completePeerConnection])

    useEffect(()=>{
        let timeout
        if(isCallEnded) {
            timeout = setTimeout(() => {
                setIsCallEnded(false)
            },2000)
        }
        return () => clearTimeout(timeout)
    },[isCallEnded])

    
    return <SocketContext.Provider value={{
        onlineUsers,
        handleCall,
        ongoingCall,
        peer,
        localStream,
        handleJoinCall,
        handleHangup,
        isCallEnded,
    }}>
{children}
    </SocketContext.Provider>
}


export const useSocket = () =>{
    const context = useContext(SocketContext)

    if(context === null) {
        throw new Error("useSocket must be used within a SocketContextProvider")
    }

    return context
}