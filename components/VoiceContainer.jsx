"use client";

import { useEffect, useRef } from "react";

const VoiceContainer = ({ stream, isLocalStream }) => {
    const audioRef = useRef(null);

    // Set the audio stream to the <audio> element
    useEffect(() => {
        if (audioRef.current && stream) {
            audioRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <audio
            ref={audioRef}
            autoPlay
            playsInline
            muted={isLocalStream} // Mute the local stream to avoid feedback
            className="hidden" // Hide the audio element since it doesn't need to be visible
        />
    );
};

export default VoiceContainer;