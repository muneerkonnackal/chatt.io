"use client";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const AudioIndicator = ({ audioLevel, isMuted }) => {
    return (
        <div className="flex items-center gap-2">
            <div className={`relative w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center ${isMuted ? "opacity-50" : ""}`}>
                {isMuted ? <FaMicrophoneSlash size={20} color="red" /> : <FaMicrophone size={20} color="white" />}
                {!isMuted && (
                    <div 
                        className="absolute inset-0 rounded-full animate-ping bg-green-400" 
                        style={{ opacity: Math.min(audioLevel / 255, 1) }} 
                    />
                )}
            </div>
        </div>
    );
};

export default AudioIndicator;