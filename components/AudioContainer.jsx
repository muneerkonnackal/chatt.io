import { useEffect, useRef } from "react";

const AudioContainer = ({ stream, isLocalStream }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current && stream) {
            audioRef.current.srcObject = stream;
        }
    }, [stream]);

    return <audio ref={audioRef} autoPlay playsInline muted={isLocalStream} controls />;
};

export default AudioContainer;
