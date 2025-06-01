"use client";

import { useEffect, useRef, useState } from "react";
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundwaves from "@/constants/soundwaves.json";
import { addToSessionHistory } from "@/lib/actions/companion.action";
// Update the path below to the correct location of companion.actions in your project structure

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const CompanionComponent = ({
  companionId,
  subject,
  topic,
  name,
  userName,
  userImage,
  style,
  voice,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [typingDots, setTypingDots] = useState(false);

  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (lottieRef) {
      if (isSpeaking) {
        lottieRef.current?.play();
      } else {
        lottieRef.current?.stop();
      }
    }
  }, [isSpeaking, lottieRef]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      setTypingDots(false);

      addToSessionHistory(companionId);
    };

    const onMessage = (message: Message) => {
      // Debug log to see what messages are coming
      console.log("Received message:", message);

      // Handle both partial and final transcripts
      if (message.type === "transcript") {
        // Only process if we have actual content
        if (message.transcript && message.transcript.trim() !== "") {
          const newMessage = {
            role: message.role,
            content: message.transcript.trim(),
          };

          setMessages((prev) => {
            // If it's a final transcript, replace any partial transcript from same role
            if (message.transcriptType === "final") {
              return [newMessage, ...prev];
            } else {
              // For partial transcripts, replace the top message if it's from same role
              if (prev.length > 0 && prev[0].role === message.role) {
                return [newMessage, ...prev.slice(1)];
              } else {
                return [newMessage, ...prev];
              }
            }
          });
        }
      }

      // Handle other message types if needed
      // (Removed invalid check for 'conversation-update' as it's not a valid MessageType)
    };

    const onSpeechStart = () => {
      console.log("Speech started");
      setIsSpeaking(true);
      setTypingDots(true);
    };

    const onSpeechEnd = () => {
      console.log("Speech ended");
      setIsSpeaking(false);
      setTypingDots(false);
    };

    const onError = (error: Error) => {
      console.error("VAPI Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
    };
  }, []);

  const toggleMicrophone = () => {
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    setMessages([]); // Clear previous messages

    const assistantOverrides = {
      variableValues: { subject, topic, style },
      clientMessages: ["transcript"],
      serverMessages: [],
    };

    try {
      // @ts-expect-error
      vapi.start(configureAssistant(voice, style), assistantOverrides);
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-3">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
      <span className="text-xs text-gray-500 ml-2">
        {name.split(" ")[0]} is thinking...
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            AI Learning Companion
          </h1>
          <p className="text-gray-600 text-lg">
            Interactive voice-powered learning experience
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Companion Side */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex flex-col items-center">
              {/* Companion Avatar with Enhanced Effects */}
              <div className="relative mb-6">
                <div
                  className={cn(
                    "relative w-56 h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center transition-all duration-500",
                    callStatus === CallStatus.ACTIVE && "shadow-2xl scale-105",
                    callStatus === CallStatus.CONNECTING && "animate-pulse"
                  )}
                  style={{
                    backgroundColor: getSubjectColor(subject),
                    boxShadow:
                      callStatus === CallStatus.ACTIVE
                        ? `0 0 60px ${getSubjectColor(subject)}40`
                        : `0 0 30px ${getSubjectColor(subject)}20`,
                  }}
                >
                  {/* Static Icon */}
                  <div
                    className={cn(
                      "absolute transition-all duration-1000 z-10",
                      callStatus === CallStatus.FINISHED ||
                        callStatus === CallStatus.INACTIVE
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95",
                      callStatus === CallStatus.CONNECTING &&
                        "opacity-100 animate-pulse scale-110"
                    )}
                  >
                    <Image
                      src={`/icons/${subject}.svg`}
                      alt={subject}
                      width={120}
                      height={120}
                      className="drop-shadow-lg"
                    />
                  </div>

                  {/* Animated Soundwaves */}
                  <div
                    className={cn(
                      "absolute transition-all duration-1000 z-20",
                      callStatus === CallStatus.ACTIVE
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                    )}
                  >
                    <Lottie
                      lottieRef={lottieRef}
                      animationData={soundwaves}
                      autoplay={false}
                      className="w-56 h-56 md:w-64 md:h-64"
                    />
                  </div>

                  {/* Pulsing Ring Effect */}
                  {(callStatus === CallStatus.ACTIVE || isSpeaking) && (
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      callStatus === CallStatus.ACTIVE &&
                        "bg-green-500 text-white animate-pulse",
                      callStatus === CallStatus.CONNECTING &&
                        "bg-yellow-500 text-white animate-bounce",
                      callStatus === CallStatus.INACTIVE &&
                        "bg-gray-400 text-white",
                      callStatus === CallStatus.FINISHED &&
                        "bg-red-500 text-white"
                    )}
                  >
                    {callStatus === CallStatus.ACTIVE && "🟢 Active"}
                    {callStatus === CallStatus.CONNECTING && "🟡 Connecting"}
                    {callStatus === CallStatus.INACTIVE && "⚫ Offline"}
                    {callStatus === CallStatus.FINISHED && "🔴 Ended"}
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-2">{name}</h2>
              <p className="text-gray-600 text-center mb-4">
                Your AI {subject} tutor
              </p>

              {/* Subject Badge */}
              <div
                className="px-6 py-2 rounded-full text-sm font-semibold text-white mb-6"
                style={{ backgroundColor: getSubjectColor(subject) }}
              >
                📚 {subject.toUpperCase()}
              </div>
            </div>
          </div>

          {/* User Side */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex flex-col items-center">
              {/* User Avatar */}
              <div className="relative mb-6">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl border-4 border-white/50">
                  <Image
                    src={userImage}
                    alt={userName}
                    width={224}
                    height={224}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {/* Online Status */}
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {userName}
              </h2>

              {/* Control Buttons */}
              <div className="w-full max-w-sm space-y-4">
                {/* Microphone Button */}
                <button
                  className={cn(
                    "w-full flex items-center justify-center gap-3 p-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105",
                    "border-2 shadow-lg hover:shadow-xl",
                    isMuted
                      ? "bg-red-500 text-white border-red-300 hover:bg-red-600"
                      : "bg-green-500 text-white border-green-300 hover:bg-green-600",
                    callStatus !== CallStatus.ACTIVE &&
                      "opacity-50 cursor-not-allowed hover:scale-100"
                  )}
                  onClick={toggleMicrophone}
                  disabled={callStatus !== CallStatus.ACTIVE}
                >
                  <div
                    className={cn(
                      "transition-transform duration-200",
                      isSpeaking && "animate-pulse scale-110"
                    )}
                  >
                    <Image
                      src={isMuted ? "/icons/mic-off.svg" : "/icons/mic-on.svg"}
                      alt="mic"
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="text-sm md:text-base">
                    {isMuted ? "🔇 Mic Off" : "🎤 Mic On"}
                  </span>
                </button>

                {/* Main Action Button */}
                <button
                  className={cn(
                    "w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl",
                    callStatus === CallStatus.ACTIVE
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700",
                    callStatus === CallStatus.CONNECTING &&
                      "animate-pulse cursor-not-allowed"
                  )}
                  onClick={
                    callStatus === CallStatus.ACTIVE
                      ? handleDisconnect
                      : handleCall
                  }
                  disabled={callStatus === CallStatus.CONNECTING}
                >
                  {callStatus === CallStatus.ACTIVE && "🛑 End Session"}
                  {callStatus === CallStatus.CONNECTING && "⏳ Connecting..."}
                  {callStatus === CallStatus.INACTIVE && "🚀 Start Learning"}
                  {callStatus === CallStatus.FINISHED && "🔄 Start New Session"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              💬 Live Conversation
              {callStatus === CallStatus.ACTIVE && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-normal">Live</span>
                </div>
              )}
            </h3>
          </div>

          {/* Messages Container */}
          <div
            className="h-96 overflow-y-auto p-6 space-y-4"
            style={{ scrollbarWidth: "thin" }}
          >
            {messages.length === 0 && callStatus === CallStatus.ACTIVE && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-3xl">👋</span>
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  Ready to start learning!
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Your conversation will appear here...
                </p>
              </div>
            )}

            {messages.length === 0 && callStatus !== CallStatus.ACTIVE && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl">💤</span>
                </div>
                <p className="text-gray-400 text-lg font-medium">
                  Start a session to begin chatting
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-4">
              {messages
                .slice()
                .reverse()
                .map((message, index) => {
                  if (message.role === "assistant") {
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 animate-slideInLeft"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                          style={{ backgroundColor: getSubjectColor(subject) }}
                        >
                          🤖
                        </div>
                        <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl rounded-tl-sm p-4 shadow-md border border-blue-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-blue-800 text-sm">
                              {name.split(" ")[0].replace(/[.,]/g, "")}
                            </span>
                            <span className="text-xs text-gray-500">
                              AI Tutor
                            </span>
                          </div>
                          <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 flex-row-reverse animate-slideInRight"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
                          <Image
                            src={userImage}
                            alt={userName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl rounded-tr-sm p-4 shadow-md border border-green-100">
                          <div className="flex items-center gap-2 mb-1 justify-end">
                            <span className="text-xs text-gray-500">You</span>
                            <span className="font-bold text-green-800 text-sm">
                              {userName}
                            </span>
                          </div>
                          <p className="text-gray-800 text-sm md:text-base leading-relaxed text-right">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    );
                  }
                })}
            </div>

            {/* Typing Indicator */}
            {typingDots && (
              <div className="flex items-start gap-3 animate-fadeIn">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  style={{ backgroundColor: getSubjectColor(subject) }}
                >
                  🤖
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl rounded-tl-sm p-4 shadow-md border border-blue-100">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Footer */}
          <div className="bg-gray-50 p-4 border-t">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                🎤 Voice-powered learning
              </span>
              <span className="flex items-center gap-1">
                🤖 AI-enhanced tutoring
              </span>
              <span className="flex items-center gap-1">
                📚 Real-time interaction
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CompanionComponent;
