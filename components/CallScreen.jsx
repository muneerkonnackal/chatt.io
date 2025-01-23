"use client";
import React, { useCallback, useEffect, useState } from "react";
import { MdMic, MdMicOff } from "react-icons/md";
import { ImPhoneHangUp } from "react-icons/im";
import { useSocket } from "@/context/SocketContext";
import Image from "next/image";
import AudioContainer from "./AudioContainer";
import { useUser } from "@clerk/nextjs";

const CallScreen = () => {
    const { ongoingVoiceCall, handleVoiceHangup, localVoiceStream, voicePeer, voiceCallEnded } = useSocket();

    // Initialize state for mic toggle
    const [isMicOn, setIsMicOn] = useState(true);
    const { user, isLoaded } = useUser();

    const [isAdmin, setIsAdmin] = useState(false);

    // Ensure ongoingVoiceCall and its participants are always defined
    const caller = ongoingVoiceCall?.participants?.caller || {};
    const receiver = ongoingVoiceCall?.participants?.receiver || {};

    // Mic toggle handler
    const toggleMic = useCallback(() => {
        if (localVoiceStream) {
            const audioTrack = localVoiceStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicOn(audioTrack.enabled);
            } else {
                console.error("No audio track available in localVoiceStream");
            }
        } else {
            console.error("No localVoiceStream available for toggling mic");
        }
    }, [localVoiceStream]);

    console.log('localvoicestream11111', localVoiceStream);
    console.log('ongoingvoicecall2222', ongoingVoiceCall);
    console.log('ongoingvoicePeer33333', voicePeer);

     const ADMIN_EMAIL = "muneer@steyp.com"; // Define the admin email
    
        useEffect(() => {
            if (isLoaded && user) {
                const userEmail = user.emailAddresses ? user.emailAddresses[0].emailAddress : null;
                setIsAdmin(userEmail === ADMIN_EMAIL);
            }
        }, [user, isLoaded]);

    const isOnCall = localVoiceStream && voicePeer && ongoingVoiceCall ? true : false;

    if (!localVoiceStream && !voicePeer) return null;

    if (voiceCallEnded && isAdmin) {
        return <div className="mt-5 text-rose-500 text-center">Call Ended</div>;
    }

    // Render the UI only if `ongoingVoiceCall` exists
    if (!ongoingVoiceCall) {
        return <div className="hidden">No active call</div>; // Prevent disruptive rendering issues
    }

    return (
        <div className="call-screen">
            <h1>Voice Call</h1>
            <div className="call-details">
                <Image
                    src={caller?.profile?.imageUrl || "/default-avatar.png"}
                    alt="Caller"
                    width={48}
                    height={48}
                />
                <h2>{caller?.profile?.fullName || "Unknown Caller"}</h2>
                <p>Calling: {receiver?.profile?.fullName || "Unknown Receiver"}</p>
            </div>

            <div className="mt-4 relative max-w-[400px] mx-auto">
                {localVoiceStream && (
                    <AudioContainer stream={localVoiceStream} isVoiceStream={true} isOnCall={isOnCall} />
                )}
                {voicePeer && voicePeer.stream && (
                    <AudioContainer stream={voicePeer.stream} isVoiceStream={true} isOnCall={isOnCall} />
                )}
            </div>

            <div className="mt-8 gap-2 flex items-center justify-center">
                <button onClick={toggleMic}>
                    {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
                </button>
                <button
                    className="bg-rose-500 text-white rounded-full p-2"
                    onClick={() => handleVoiceHangup({ ongoingVoiceCall })}
                >
                    <ImPhoneHangUp />
                </button>
            </div>
        </div>
    );
};

export default CallScreen;