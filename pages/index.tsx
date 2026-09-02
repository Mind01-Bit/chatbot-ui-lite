import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"chat" | "resume" | "matches" | "optimizer" | "local">("chat");

  const [oldResume, setOldResume] = useState<string>("[Past Frontier text will appear here once pasted in chat...]");
  const [revisedResume, setRevisedResume] = useState<string>("[Your beautifully translated Master Resume will generate here...]");
  const [zipCode, setZipCode] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages })
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) return;

    setLoading(false);
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          { role: "assistant", content: chunkValue }
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = { ...lastMessage, content: lastMessage.content + chunkValue };
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }
  };

  const handleReset = () => {
    setMessages([{ role: "assistant", content: "Welcome to your clean slate. Let's take a breath and connect as human beings. May I ask your first name, and what city or zip code you are calling home from today?" }]);
  };

  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { handleReset(); }, []);

  return (
    <>
      <Head>
        <title>Alighned Path - Digital Sanctuary</title>
        <meta name="description" content="A private, supportive digital sanctuary designed to help you shed your old professional boxes, uncover your hidden executive strength, and confidently step center-stage into the lead role of your own life story." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://googleapis.com" rel="stylesheet" />
      </Head>

      <div className="flex flex-col h-screen" style={{ backgroundColor: "#FBF9F6", color: "#2D2A26" }}>
        <Navbar />
        
        <div className="flex-1 overflow-hidden flex flex-col justify-center">
          <div className="max-w-7xl w-full mx-auto h-[85vh] px-4 py-4 md:py-6 flex flex-col md:flex-row gap-6">
            
            {!hasStarted ? (
              <div className="text-center my-auto px-6 py-12 rounded-3xl bg-white/40 border border-[#EBE7E0] backdrop-blur-md shadow-sm transition-all duration-500 max-w-2xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-light tracking-wide mb-6 text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>Alighned Path</h1>
                <div className="w-12 h-[1px] bg-[#607264] mx-auto mb-8"></div>
                <p className="text-sm sm:text-base text-[#5C574F] leading-relaxed italic max-w-lg mx-auto mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  &ldquo;A private, supportive digital sanctuary designed to help you shed your old professional boxes, uncover the hidden executive strength you already possess, and confidently step center-stage into the lead role of your own life story—all while fiercely protecting your peace of mind along the way.&rdquo;
                </p>
                <button onClick={() => setHasStarted(true)} className="bg-[#607264] hover:bg-[#4D5C50] text-white tracking-widest text-xs font-semibold uppercase px-8 py-4 rounded-full shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Step onto your path
                </button>
              </div>
            ) : (
              <>
                {/* Left Column Control Center */}
                <section className="w-full md:w-80 flex flex-col gap-4 flex-shrink-0 h-auto md:h-full">
                  <div className="bg-white/40 border border-[#EBE7E0] rounded-2xl p-4 shadow-sm backdrop-blur-md hidden md:flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#607264] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Workspace Navigation</span>
                    
                    <button onClick={() => setActiveTab("chat")} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${activeTab === "chat" ? "bg-[#607264] text-white" : "hover:bg-white text-[#5C574F]"}`}>💬 Sanctuary Chat</button>
                    <button onClick={() => setActiveTab("resume")} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${activeTab === "resume" ? "bg-[#607264] text-white" : "hover:bg-white text-[#5C574F]"}`}>📄 Resume Dressing Room</button>
                    <button onClick={() => setActiveTab("matches")} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${activeTab === "matches" ? "bg-[#607264] text-white" : "hover:bg-white text-[#5C574F]"}`}>🎯 Top 3-5 Job Titles</button>
                    <button onClick={() => setActiveTab("optimizer")} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${activeTab === "optimizer" ? "bg-[#607264] text-white" : "hover:bg-white text-[#5C574F]"}`}>⚡ LinkedIn & Indeed Studio</button>
                    <button onClick={() => setActiveTab("local")} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${activeTab === "local" ? "bg-[#607264] text-white" : "hover:bg-white text-[#5C574F]"}`}>📍 Local Small Business</button>
                  </div>
                </section>

                {/* Right Main Workspace Console */}
                <section className="flex-1 flex flex-col bg-white/50 border border-[#EBE7E0] rounded-3xl overflow-hidden shadow-sm backdrop-blur-md h-full">
                  <div className="flex md:hidden border-b border-[#EBE7E0] bg-white/50 overflow-x-auto">
                    <button onClick={() => setActiveTab("chat")} className={`px-4 py-3 text-[10px] font-bold uppercase whitespace-nowrap ${activeTab === "chat" ? "text-[#607264] border-b-2 border-[#607264]" : "text-[#7A756B]"}`}>Chat</button>
                    <button onClick={() => setActiveTab("resume")} className={`px-4 py-3 text-[10px] font-bold uppercase whitespace-nowrap ${activeTab === "resume" ? "text-[#607264] border-b-2 border-[#607264]" : "text-[#7A756B]"}`}>Resume</button>
                    <button onClick={() => setActiveTab("matches")} className={`px-4 py-3 text-[10px] font-bold uppercase whitespace-nowrap ${activeTab === "matches" ? "text-[#607264] border-b-2 border-[#607264]" : "text-[#7A756B]"}`}>Titles</button>
                    <button onClick={() => setActiveTab("optimizer")} className={`px-4 py-3 text-[10px] font-bold uppercase whitespace-nowrap ${activeTab === "optimizer" ? "text-[#607264] border-b-2 border-[#607264]" : "text-[#7A756B]"}`}>Social</button>
                    <button onClick={() => setActiveTab("local")} className={`px-4 py-3 text-[10px] font-bold uppercase whitespace-nowrap ${activeTab === "local" ? "text-[#607264] border-b-2 border-[#607264]" : "text-[#7A756B]"}`}>Local</button>
                  </div>

                  <div className="flex-1 overflow-hidden flex flex-col relative h-full">
                    {activeTab === "chat" && (
                      <div className="flex-1 flex flex-col h-full overflow-hidden">
                        <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar">
                          <Chat messages={messages} loading={loading} onSend={handleSend} onReset={handleReset} />
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
                    )}

                    {activeTab === "resume" && (
                      <div className="flex-1 overflow-y-auto p-6 space-y-6 h-full custom-scrollbar animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                          <div className="flex flex-col bg-white/40 p-5 rounded-2xl border border-[#EBE7E0]">
                            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#A34A4A] mb-3">Old Frontier Profile</span>

                            {oldResume}
                            
                            Reframed Master Profile
                            {revisedResume}
                            
                            )}
                            
                            {activeTab === "matches" && (

                            Aligned Job Title Architecture
                            Your Top High-Value Target Fits
                            Based on your deep operational history, your capabilities have been translated into
                            these top corporate paths to protect you from algorithmic application spam.

                            1. Operations Management DirectorLeverages your 12+ years of high-volume logistics handling, scheduling coordination, and crisis mitigation.
                            2. Customer Success Strategic Account LeadMaps directly to your extensive tenure managing critical escalation resolution and protecting account revenue retention.
                            3. Corporate Training & Onboarding LeadBuilt upon your documented history of informally pairing with, mentoring, and scaling junior operational personnel.


                            )}
                            {activeTab === "optimizer" && (
                        
                            Backstage Design Studio
                            Algorithm & Recruiter Magnets

                           "LinkedIn Premium Anchor”
                            “Headline Blueprint: Operations Specialist | Scaling Revenue Protection | Cross-Functional Workflows”
                            Copy Copy-Ready Template
                            
                            “Indeed Filter Optimizer”
                            Structured background metrics formatted perfectly to catch automated 
                            agency recruiter sorting blocks.
                            Copy Verified Profile Content


                            }}

                            {activeTab === "local" && (

                            Zip Code Scouting Portal
                            Local Small Business Micro-Possibilities


                            <input type="text" placeholder="Enter target Zip Code..." value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="bg-white border border-[#EBE7E0] rounded-xl px-4                               py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#607264]" />Map Opportunities


                            [Interactive local mapping engine layout will populate scouting anchors here for Zip Code {zipCode || "XXXXX"}...]


                            ]]

                          </>
                          );
                          }

                          
                            
