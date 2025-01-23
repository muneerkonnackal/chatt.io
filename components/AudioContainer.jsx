// import { cn } from "@/lib/utils";
// import { useEffect, useRef } from "react";

// const AudioContainer = ({ stream, isVoiceStream, isOngoingVoiceCall }) => {
//     const audioRef = useRef(null);

//     // useEffect(() => {
//     //     if (audioRef.current && stream) {
//     //         audioRef.current.srcObject = stream;
//     //     }
//     // }, [stream]);

//     useEffect(() => {
//         const playAudio = async () => {
//             if (audioRef.current && stream) {
//                 try {
//                     // Assign the stream only if it's different
//                     if (audioRef.current.srcObject !== stream) {
//                         audioRef.current.srcObject = stream;
//                     }
//                     await audioRef.current.play();
//                 } catch (error) {
//                     console.error("Audio playback error:", error);
//                 }
//             }
//         };
    
//         playAudio();
//     }, [stream]);
    
    
    

//     return (
//         <audio
//             className={cn("rounded border w-[400px]")}
//             ref={audioRef}
//             autoPlay
//             muted
//         ></audio>
//     );
// };

// export default AudioContainer;

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const AudioContainer = ({ stream, isVoiceStream, isOngoingVoiceCall }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current && stream) {
        try {
          if (audioRef.current.srcObject !== stream) {
            audioRef.current.srcObject = stream;
          }
          await audioRef.current.play();
        } catch (error) {
          console.error("Audio playback error:", error);
        }
      }
    };

    playAudio();
  }, [stream]);

  return (
    <audio
      className={cn("rounded border w-[400px]")}
      ref={audioRef}
      autoPlay
      muted={false} // Remove muted for voice calls
    ></audio>
  );
};

export default AudioContainer;