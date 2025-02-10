// "use client";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { MdMic, MdMicOff } from "react-icons/md";
// import { ImPhoneHangUp } from "react-icons/im";
// import { useSocket } from "@/context/SocketContext";
// import Image from "next/image";
// import AudioContainer from "./AudioContainer";
// import { useUser } from "@clerk/nextjs";

// // const CallScreen = () => {
// //     const { ongoingVoiceCall, handleVoiceHangup, localVoiceStream, voicePeer, voiceCallEnded } = useSocket();

// //     // Initialize state for mic toggle
// //     const [isMicOn, setIsMicOn] = useState(true);
// //     const { user, isLoaded } = useUser();

// //     const [isAdmin, setIsAdmin] = useState(false);

// //     // Ensure ongoingVoiceCall and its participants are always defined
// //     const caller = ongoingVoiceCall?.participants?.caller || {};
// //     const receiver = ongoingVoiceCall?.participants?.receiver || {};

// //     // Mic toggle handler
// //     const toggleMic = useCallback(() => {
// //         if (localVoiceStream) {
// //             const audioTrack = localVoiceStream.getAudioTracks()[0];
// //             if (audioTrack) {
// //                 audioTrack.enabled = !audioTrack.enabled;
// //                 setIsMicOn(audioTrack.enabled);
// //             } else {
// //                 console.error("No audio track available in localVoiceStream");
// //             }
// //         } else {
// //             console.error("No localVoiceStream available for toggling mic");
// //         }
// //     }, [localVoiceStream]);

// //     console.log('localvoicestream11111', localVoiceStream);
// //     console.log('ongoingvoicecall2222', ongoingVoiceCall);
// //     console.log('ongoingvoicePeer33333', voicePeer);

// //      const ADMIN_EMAIL = "muneer@steyp.com"; // Define the admin email
    
// //         useEffect(() => {
// //             if (isLoaded && user) {
// //                 const userEmail = user.emailAddresses ? user.emailAddresses[0].emailAddress : null;
// //                 setIsAdmin(userEmail === ADMIN_EMAIL);
// //             }
// //         }, [user, isLoaded]);

// //     const isOnCall = localVoiceStream && voicePeer && ongoingVoiceCall ? true : false;

// //     if (!localVoiceStream && !ongoingVoiceCall) return null;

// //     if (voiceCallEnded && isAdmin) {
// //         return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
// //     }

// //     // Render the UI only if `ongoingVoiceCall` exists
// //     if (!ongoingVoiceCall) {
// //         return <div className="hidden">No active call</div>; // Prevent disruptive rendering issues
// //     }

// //     const call = ongoingVoiceCall?.isRinging ? ongoingVoiceCall : null;
// // const isVoiceCall = Boolean(call);

// // // if (!call) return null; // Don't render if no call is ongoing

// // // const callerProfile = call.participants?.caller?.profile;
// // // console.log('callproffffcallscreen>>>3', callerProfile);

// //     return (
// //         <div className="call-screen">
// //             <h1>Voice Call</h1>
// //             <div className="call-details">
// //                 <Image
// //                     src={caller?.profile?.imageUrl || "/default-avatar.png"}
// //                     alt="Caller"
// //                     width={48}
// //                     height={48}
// //                 />
// //                 <h2>{caller?.profile?.fullName || "Unknown Caller"}</h2>
// //                 <p>Calling: {receiver?.profile?.fullName || "Unknown Receiver"}</p>
// //             </div>

// //             {/* <div className="mt-4 relative max-w-[400px] mx-auto">
// //                 {localVoiceStream && (
// //                     <AudioContainer stream={localVoiceStream} isVoiceStream={true} isOnCall={isOnCall} />
// //                 )}
// //                 {voicePeer && voicePeer.stream && (
// //                     <AudioContainer stream={voicePeer.stream} isVoiceStream={true} isOnCall={isOnCall} />
// //                 )}
// //             </div> */}

// // <div className="mt-4 relative max-w-[400px] mx-auto">
// //     {localVoiceStream && (
// //         <AudioContainer stream={localVoiceStream} isVoiceStream={true} isOnCall={isOnCall} />
// //     )}
// //     {voicePeer?.stream ? (
// //         <AudioContainer stream={voicePeer.stream} isVoiceStream={true} isOnCall={isOnCall} />
// //     ) : (
// //         <p>Waiting for remote stream...</p>
// //     )}
// // </div>


// //             <div className="mt-8 gap-2 flex items-center justify-center">
// //                 <button onClick={toggleMic}>
// //                     {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
// //                 </button>
// //                 <button
// //                     className="bg-rose-500 text-white rounded-full p-2"
// //                     onClick={() => handleVoiceHangup({ ongoingVoiceCall })}
// //                 >
// //                     <ImPhoneHangUp />
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };

// // export default CallScreen;

// // const CallScreen = () => {
// //     const { ongoingVoiceCall, handleVoiceHangup, localVoiceStream, voicePeer, voiceCallEnded } = useSocket();
// //     const [isMicOn, setIsMicOn] = useState(true);
// //     const { user, isLoaded } = useUser();
// //     const [isAdmin, setIsAdmin] = useState(false);

// //     const toggleMic = useCallback(() => {
// //         if (localVoiceStream) {
// //             const audioTrack = localVoiceStream.getAudioTracks()[0];
// //             if (audioTrack) {
// //                 audioTrack.enabled = !audioTrack.enabled;
// //                 setIsMicOn(audioTrack.enabled);
// //             }
// //         }
// //     }, [localVoiceStream]);

// //     const ADMIN_EMAIL = "muneer@steyp.com";
// //     useEffect(() => {
// //         if (isLoaded && user) {
// //             const userEmail = user.emailAddresses ? user.emailAddresses[0].emailAddress : null;
// //             setIsAdmin(userEmail === ADMIN_EMAIL);
// //         }
// //     }, [user, isLoaded]);
// //         // Add this useEffect to debug remote stream updates
// //         useEffect(() => {
// //             console.log('Voice Peer Updated:', voicePeer);
// //             if (voicePeer?.remoteStream) {
// //                 console.log('Remote stream tracks:', voicePeer.remoteStream.getTracks());
// //             }
// //         }, [voicePeer]);
    

// //     const caller = ongoingVoiceCall?.participants?.caller || {};
// //     const receiver = ongoingVoiceCall?.participants?.receiver || {};

// //     console.log('ongoing Call>>', ongoingVoiceCall);
// //     console.log('ongoing Caller>>', caller);
// //     console.log('ongoing receiver>>', receiver);


// //     const isOnCall = localVoiceStream && voicePeer && ongoingVoiceCall;

// //     if (!localVoiceStream && !ongoingVoiceCall) return null;

// //     if (voiceCallEnded && isAdmin) {
// //         return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
// //     }

 

// //     if (ongoingVoiceCall?.isRinging) {
// //         return (
// //             <div className="call-screen">
// //                 <h1>Incoming Call</h1>
// //                 <div className="call-details">
// //                     <Image
// //                         src={caller?.profile?.imageUrl || "/default-avatar.png"}
// //                         alt="Caller"
// //                         width={48}
// //                         height={48}
// //                     />
// //                     <h2>{caller?.profile?.fullName || "Unknown Caller"}</h2>
// //                     <p>Calling you...</p>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="call-screen">
// //             <h1>Voice Call</h1>
// //             <div className="call-details">
// //                 <Image
// //                     src={caller?.profile?.imageUrl || "/default-avatar.png"}
// //                     alt="Caller"
// //                     width={48}
// //                     height={48}
// //                 />
// //                 <h2>{caller?.profile?.fullName || "Unknown Caller"}</h2>
// //                 <p>Talking with: {receiver?.profile?.fullName || "Unknown Receiver"}</p>
// //             </div>

// //             {voicePeer?.stream ? (
// //   <AudioContainer stream={voicePeer.stream} isRemoteStream={true} />
// // ) : (
// //   <div className="stream-status">
// //     <p>Connecting audio...</p>
// //     <div className="loading-spinner" />
// //   </div>
// // )}

// //             // In your CallScreen component:
// // <div className="mt-4 relative max-w-[400px] mx-auto">
// //   {/* Local stream (muted) */}
// //   <AudioContainer 
// //   stream={localVoiceStream} 
// //   isRemoteStream={false}  // Add muted attribute
// // />
// // <AudioContainer 
// //   stream={voicePeer?.remoteStream} 
// //   isRemoteStream={true}   // Enable volume controls
// // />
// // </div>


// //             <div className="mt-8 gap-2 flex items-center justify-center">
// //                 <button onClick={toggleMic}>
// //                     {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
// //                 </button>
// //                 <button
// //                     className="bg-rose-500 text-white rounded-full p-2"
// //                     onClick={() => handleVoiceHangup({ ongoingVoiceCall })}
// //                 >
// //                     <ImPhoneHangUp />
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };


// const CallScreen = () => {
//     const { ongoingVoiceCall, handleVoiceHangup, localVoiceStream, voicePeer, voiceCallEnded } = useSocket();
//     const [isMicOn, setIsMicOn] = useState(true);
//     const { user, isLoaded } = useUser();
//     const [isAdmin, setIsAdmin] = useState(false);
//     const audioRef = useRef(null);

//     const toggleMic = useCallback(() => {
//         if (localVoiceStream) {
//             const audioTrack = localVoiceStream.getAudioTracks()[0];
//             if (audioTrack) {
//                 audioTrack.enabled = !audioTrack.enabled;
//                 setIsMicOn(audioTrack.enabled);
//             }
//         }
//     }, [localVoiceStream]);

//     const ADMIN_EMAIL = "muneer@steyp.com";
//     useEffect(() => {
//         if (isLoaded && user) {
//             const userEmail = user.emailAddresses?.[0]?.emailAddress;
//             setIsAdmin(userEmail === ADMIN_EMAIL);
//         }
//     }, [user, isLoaded]);

//     useEffect(() => {
//         console.log('Voice Peer Updated:', voicePeer);
//         if (voicePeer?.remoteStream) {
//             console.log('Remote stream tracks:', voicePeer.remoteStream.getTracks());
//         }
//     }, [voicePeer]);

    
//     useEffect(() => {
//         if (audioRef.current && voicePeer?.remoteStream) {
//             console.log('Setting remote stream to audio element:', voicePeer.remoteStream);
//             audioRef.current.srcObject = voicePeer.remoteStream;
            
//             // Explicitly play to handle browser autoplay policies
//             audioRef.current.play().catch(error => {
//                 console.log('Audio play failed:', error);
//             });
//         }
//     }, [voicePeer?.remoteStream]);

//     const caller = ongoingVoiceCall?.participants?.caller || {};
//     const receiver = ongoingVoiceCall?.participants?.receiver || {};

//     const isOnCall = localVoiceStream && voicePeer && ongoingVoiceCall;

//     if (!localVoiceStream && !ongoingVoiceCall) return null;

//     if (voiceCallEnded && isAdmin) {
//         return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
//     }


//     if (ongoingVoiceCall?.isRinging) {
//         return (
//             <div className="call-screen">
//                 <h1>Incoming Call</h1>
//                 <div className="call-details">
//                     <Image
//                         src={caller?.profile?.imageUrl || "/default-avatar.png"}
//                         alt="Caller"
//                         width={48}
//                         height={48}
//                     />
//                     <h2>{caller?.profile?.fullName || "Unknown Caller"}</h2>
//                     <p>Calling you...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="call-screen">
//             <h1>Voice Call</h1>
//             <div className="call-details">
//                 <Image
//                     src={caller?.profile?.imageUrl || "/default-avatar.png"}
//                     alt="Caller"
//                     width={48}
//                     height={48}
//                 />
//                 <h2>{caller?.profile?.fullName || "Unknown Caller"}</h2>
//                 <p>Talking with: {receiver?.profile?.fullName || "Unknown Receiver"}</p>
//             </div>

//             <div className="mt-4 relative max-w-[400px] mx-auto">
//                 {/* Local stream (muted) */}
//                 {/* {voicePeer?.remoteStream && (
//     <audio
//         ref={(audioRef) => {
//             if (audioRef && voicePeer.remoteStream) {
//                 audioRef.srcObject = voicePeer.remoteStream;
//             }
//         }}
//         autoPlay
//         muted={false}
//     />
// )} */}      
//           <audio ref={audioRef} autoPlay muted={false} />


//             </div>

//             <div className="mt-8 gap-2 flex items-center justify-center">
//                 <button onClick={toggleMic}>
//                     {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
//                 </button>
//                 <button
//                     className="bg-rose-500 text-white rounded-full p-2"
//                     onClick={() => handleVoiceHangup({ ongoingVoiceCall })}
//                 >
//                     <ImPhoneHangUp />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default CallScreen;

// // export default CallScreen;


"use client";

import { useSocket } from "@/context/SocketContext";
import { useEffect, useState, useCallback } from "react";
import { MdMic, MdMicOff } from "react-icons/md";
import { ImPhoneHangUp } from "react-icons/im";
import { useUser } from "@clerk/nextjs";
import AudioContainer from "./AudioContainer";

const AudioCall = () => {
    const { handleVoiceCall, // **Voice call function**
        handleJoinVoiceCall, // **Voice join call**
        handleVoiceHangup, // **Voice hangup**
        ongoingVoiceCall, // **Voice call state**
        localVoiceStream, // **Voice stream**
        voicePeer,
        voiceCallEnded } = useSocket();
    const [isMicOn, setIsMicOn] = useState(true);
    const { user, isLoaded } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);

    const ADMIN_EMAIL = "muneer@steyp.com";

    useEffect(() => {
        if (isLoaded && user) {
            const userEmail = user.emailAddresses ? user.emailAddresses[0].emailAddress : null;
            setIsAdmin(userEmail === ADMIN_EMAIL);
        }
    }, [user, isLoaded]);

    useEffect(() => {
        if (localVoiceStream) {
            const audioTrack = localVoiceStream.getAudioTracks()[0];
            if (audioTrack) {
                setIsMicOn(audioTrack.enabled);
            }
        }
    }, [localVoiceStream]);

    const toggleMic = useCallback(() => {
        if (localVoiceStream) {
            const audioTrack = localVoiceStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    }, [localVoiceStream]);

    const isOnCall = localVoiceStream && voicePeer && ongoingVoiceCall ? true : false;

    console.log('oncallvoice>>>', isOnCall);
    console.log('oncallLocalVoiceStream>>>', localVoiceStream);
    console.log('oncallvoicePeer>>>', voicePeer);

    if (voiceCallEnded && isAdmin) {
        return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
    }

    if (!localVoiceStream && !voicePeer) return null;

    return (
        <div>
            <div className="mt-4 relative max-w-[800px] mx-auto">
                {/* {localVoiceStream && <AudioContainer stream={localVoiceStream} isLocalStream={true} />} */}
                {voicePeer && voicePeer.remoteStream && <AudioContainer stream={voicePeer.remoteStream} isLocalStream={false} />}
            </div>
            {isOnCall && (
                <div className="mt-8 gap-2 flex items-center justify-center">
                    <button onClick={toggleMic}>
                        {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
                    </button>
                    <button className="bg-rose-500 text-white rounded-full p-2" onClick={() => handleVoiceHangup({ ongoingVoiceCall })}>
                        <ImPhoneHangUp />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AudioCall;
