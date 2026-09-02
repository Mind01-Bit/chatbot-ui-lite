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

  const [activeTab, setActiveTab] = useState<
    "chat" | "resume" | "matches" | "optimizer" | "local" | "analytics"
  >("chat");

  const [oldResume, setOldResume] = useState<string>(
    "[Past Frontier text will appear here once pasted in chat...]"
  );

  const [revisedResume, setRevisedResume] = useState<string>(
    "[Your beautifully translated Master Resume will generate here...]"
  );

  const [zipCode, setZipCode] = useState<string>("");

  const [pauseCount, setPauseCount] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: updatedMessages
        })
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = response.body;

      if (!data) {
        setLoading(false);
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();

      let done = false;
      let isFirst = true;

      setLoading(false);

      while (!done) {
        const { value, done: doneReading } = await reader.read();

        done = doneReading;

        if (!value) {
          continue;
        }

        const chunkValue = decoder.decode(value, {
          stream: !doneReading
        });

        if (isFirst) {
          isFirst = false;

          setMessages((currentMessages) => [
            ...currentMessages,
            {
              role: "assistant",
              content: chunkValue
            }
          ]);
        } else {
          setMessages((currentMessages) => {
            const lastMessage =
              currentMessages[currentMessages.length - 1];

            if (!lastMessage) {
              return currentMessages;
            }

            const updatedMessage = {
              ...lastMessage,
              content: lastMessage.content + chunkValue
            };

            return [
              ...currentMessages.slice(0, -1),
              updatedMessage
            ];
          });
        }
      }
    } catch (error) {
      console.error("Chat request failed:", error);

      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Welcome to your clean slate. Let's connect as human beings. May I ask your first name, and what city or zip code you are calling home from today?"
      }
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!hasStarted) {
      return;
    }

    handleReset();
    setSessionStartTime(Date.now());
    setElapsedTime(0);
    setPauseCount(0);
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || sessionStartTime <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(
        Math.floor((Date.now() - sessionStartTime) / 1000)
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [hasStarted, sessionStartTime]);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    if (hours > 0) {
      return `${hours}:${formattedMinutes}:${formattedSeconds}`;
    }

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <>
      <Head>
        <title>Alighned Path - Digital Sanctuary</title>

        <meta
          name="description"
          content="A private, supportive digital sanctuary designed to help you shed your old professional boxes, uncover your hidden executive strength, and confidently step center-stage into the lead role of your own life story."
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div
        className="flex min-h-screen flex-col"
        style={{
          backgroundColor: "#FBF9F6",
          color: "#2D2A26"
        }}
      >
        <Navbar />

        <main className="flex flex-1 flex-col justify-center overflow-hidden">
          <div className="mx-auto flex h-[85vh] w-full max-w-7xl flex-col gap-6 px-4 py-4 md:flex-row md:py-6">

            {!hasStarted ? (
              <div className="mx-auto my-auto max-w-2xl rounded-3xl border border-[#EBE7E0] bg-white/40 px-6 py-12 text-center shadow-sm backdrop-blur-md transition-all duration-500">

                <h1
                  className="mb-6 text-4xl font-light tracking-wide text-[#2D2A26] sm:text-5xl"
                  style={{
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  Alighned Path
                </h1>

                <div className="mx-auto mb-8 h-[1px] w-12 bg-[#607264]" />

                <p
                  className="mx-auto mb-10 max-w-lg text-sm italic leading-relaxed text-[#5C574F] sm:text-base"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  &ldquo;A private, supportive digital sanctuary designed
                  to help you shed your old professional boxes, uncover
                  the hidden executive strength you already possess,
                  and confidently step center-stage into the lead role
                  of your own life story—all while fiercely protecting
                  your peace of mind along the way.&rdquo;
                </p>

                <button
                  type="button"
                  onClick={() => setHasStarted(true)}
                  className="rounded-full bg-[#607264] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4D5C50] hover:shadow"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  Step onto your path
                </button>
              </div>
            ) : (
              <>
                <section className="hidden h-full w-full flex-shrink-0 flex-col gap-4 md:flex md:w-80">

                  <div className="flex flex-col gap-1.5 rounded-2xl border border-[#EBE7E0] bg-white/40 p-4 shadow-sm backdrop-blur-md">

                    <span
                      className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#607264]"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    >
                      Workspace Navigation
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveTab("chat")}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        activeTab === "chat"
                          ? "bg-[#607264] text-white"
                          : "text-[#5C574F] hover:bg-white"
                      }`}
                    >
                      Sanctuary Chat
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("resume")}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        activeTab === "resume"
                          ? "bg-[#607264] text-white"
                          : "text-[#5C574F] hover:bg-white"
                      }`}
                    >
                      Resume Dressing Room
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("matches")}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        activeTab === "matches"
                          ? "bg-[#607264] text-white"
                          : "text-[#5C574F] hover:bg-white"
                      }`}
                    >
                      Top 3-5 Job Titles
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("optimizer")}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        activeTab === "optimizer"
                          ? "bg-[#607264] text-white"
                          : "text-[#5C574F] hover:bg-white"
                      }`}
                    >
                      LinkedIn &amp; Indeed Studio
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("local")}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        activeTab === "local"
                          ? "bg-[#607264] text-white"
                          : "text-[#5C574F] hover:bg-white"
                      }`}
                    >
                      Local Small Business
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("analytics")}
                      className={`w-full rounded-xl px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        activeTab === "analytics"
                          ? "bg-[#A34A4A] text-white"
                          : "text-[#A34A4A] hover:bg-white"
                      }`}
                    >
                      Analytics Hub
                    </button>
                  </div>
                </section>

                <section className="flex h-full flex-1 flex-col overflow-hidden rounded-3xl border border-[#EBE7E0] bg-white/50 shadow-sm backdrop-blur-md">

                  <div className="flex flex-shrink-0 overflow-x-auto border-b border-[#EBE7E0] bg-white/50 md:hidden">

                    <button
                      type="button"
                      onClick={() => setActiveTab("chat")}
                      className={`whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase ${
                        activeTab === "chat"
                          ? "border-b-2 border-[#607264] text-[#607264]"
                          : "text-[#7A756B]"
                      }`}
                    >
                      Chat
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("resume")}
                      className={`whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase ${
                        activeTab === "resume"
                          ? "border-b-2 border-[#607264] text-[#607264]"
                          : "text-[#7A756B]"
                      }`}
                    >
                      Resume
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("matches")}
                      className={`whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase ${
                        activeTab === "matches"
                          ? "border-b-2 border-[#607264] text-[#607264]"
                          : "text-[#7A756B]"
                      }`}
                    >
                      Titles
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("optimizer")}
                      className={`whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase ${
                        activeTab === "optimizer"
                          ? "border-b-2 border-[#607264] text-[#607264]"
                          : "text-[#7A756B]"
                      }`}
                    >
                      Social
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("local")}
                      className={`whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase ${
                        activeTab === "local"
                          ? "border-b-2 border-[#607264] text-[#607264]"
                          : "text-[#7A756B]"
                      }`}
                    >
                      Local
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("analytics")}
                      className={`whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase ${
                        activeTab === "analytics"
                          ? "border-b-2 border-[#A34A4A] text-[#A34A4A]"
                          : "text-[#7A756B]"
                      }`}
                    >
                      Metrics
                    </button>
                  </div>

                  {activeTab === "chat" && (
                    <div className="flex h-full min-h-0 flex-col">

                      <div className="flex-1 overflow-hidden">
                        <Chat
                          messages={messages}
                          loading={loading}
                          onSend={handleSend}
                          onReset={handleReset}
                        />
                      </div>

                      <div className="flex flex-shrink-0 items-center justify-between gap-3 border-t border-[#EBE7E0] bg-white/70 px-4 py-3">

                        <span className="text-[10px] uppercase tracking-widest text-[#7A756B]">
                          Session {formatElapsedTime(elapsedTime)}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setPauseCount((previousCount) =>
                              previousCount + 1
                            )
                          }
                          className="rounded-full bg-[#F9ECEC] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#A34A4A] transition-colors hover:bg-[#F2D7D7]"
                        >
                          Trigger Calibration Pause
                        </button>
                      </div>

                      <div ref={messagesEndRef} />
                    </div>
                  )}

                  {activeTab === "resume" && (
                    <div className="h-full overflow-y-auto p-6">

                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#607264]">
                        Resume Dressing Room
                      </p>

                      <h2
                        className="mb-6 text-2xl"
                        style={{
                          fontFamily: "'Playfair Display', serif"
                        }}
                      >
                        Professional Profile Transformation
                      </h2>

                      <div className="grid gap-6 lg:grid-cols-2">

                        <div className="rounded-2xl border border-[#EBE7E0] bg-white p-5">
                          <h3 className="mb-3 text-sm font-semibold text-[#2D2A26]">
                            Old Frontier Profile
                          </h3>

                          <textarea
                            value={oldResume}
                            onChange={(event) =>
                              setOldResume(event.target.value)
                            }
                            className="min-h-[320px] w-full resize-none rounded-xl border border-[#EBE7E0] bg-[#FBF9F6] p-4 text-sm leading-relaxed outline-none focus:ring-1 focus:ring-[#607264]"
                          />
                        </div>

                        <div className="rounded-2xl border border-[#EBE7E0] bg-white p-5">
                          <h3 className="mb-3 text-sm font-semibold text-[#2D2A26]">
                            Reframed Master Profile
                          </h3>

                          <textarea
                            value={revisedResume}
                            onChange={(event) =>
                              setRevisedResume(event.target.value)
                            }
                            className="min-h-[320px] w-full resize-none rounded-xl border border-[#EBE7E0] bg-[#FBF9F6] p-4 text-sm leading-relaxed outline-none focus:ring-1 focus:ring-[#607264]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "matches" && (
                    <div className="h-full overflow-y-auto p-6">

                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#607264]">
                        Aligned Job Title Architecture
                      </p>

                      <h2
                        className="mb-4 text-xl"
                        style={{
                          fontFamily: "'Playfair Display', serif"
                        }}
                      >
                        Your Top High-Value Target Fits
                      </h2>

                      <p className="mb-8 max-w-3xl text-sm leading-relaxed text-[#5C574F]">
                        Based on your deep operational history, your
                        capabilities have been translated into corporate
                        paths designed to better represent your actual
                        level of responsibility and transferable value.
                      </p>

                      <div className="space-y-4">

                        <div className="rounded-2xl border border-[#EBE7E0] bg-white p-5">
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[#607264]">
                            Target 01
                          </span>

                          <h3 className="mb-2 font-semibold">
                            Operations Management Director
                          </h3>

                          <p className="text-sm leading-relaxed text-[#5C574F]">
                            Leverages high-volume operational
                            infrastructure, scheduling coordination,
                            cross-functional execution, and crisis
                            mitigation.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[#EBE7E0] bg-white p-5">
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[#607264]">
                            Target 02
                          </span>

                          <h3 className="mb-2 font-semibold">
                            Customer Success Strategic Account Lead
                          </h3>

                          <p className="text-sm leading-relaxed text-[#5C574F]">
                            Maps to extensive experience handling
                            escalations, stakeholder communication,
                            service continuity, and client retention.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[#EBE7E0] bg-white p-5">
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-[#607264]">
                            Target 03
                          </span>

                          <h3 className="mb-2 font-semibold">
                            Corporate Training &amp; Onboarding Lead
                          </h3>

                          <p className="text-sm leading-relaxed text-[#5C574F]">
                            Builds on documented experience mentoring,
                            supporting, training, and strengthening
                            junior operational personnel.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "optimizer" && (
                    <div className="h-full overflow-y-auto p-6">

                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#607264]">
                        Backstage Design Studio
                      </p>

                      <h2
                        className="mb-6 text-xl"
                        style={{
                          fontFamily: "'Playfair Display', serif"
                        }}
                      >
                        Algorithm &amp; Recruiter Magnets
                      </h2>

                      <div className="space-y-5">

                        <div className="rounded-2xl border border-[#EBE7E0] bg-white p-5">

                          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#607264]">
                            LinkedIn Premium Anchor
                          </span>

                          <p className="mb-4 text-sm leading-relaxed text-[#5C574F]">
                            Headline Blueprint: Operations Specialist |
                            Scaling Revenue Protection |
                            Cross-Functional Workflows
                          </p>

                          <button
                            type="button"
                            className="rounded-full border border-[#607264] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#607264]"
                          >
                            Copy-Ready Template
                          </button>
                        </div>

                        <div className="rounded-2xl border border-[#EBE7E0] bg-white p-5">

                          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#607264]">
                            Indeed Filter Optimizer
                          </span>

                          <p className="mb-4 text-sm leading-relaxed text-[#5C574F]">
                            Structured background metrics formatted to
                            improve alignment with automated recruiter
                            filters and role-matching systems.
                          </p>

                          <button
                            type="button"
                            className="rounded-full border border-[#607264] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#607264]"
                          >
                            Verified Profile Content
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "local" && (
                    <div className="h-full overflow-y-auto p-6">

                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#607264]">
                        Zip Code Scouting Portal
                      </p>

                      <h2
                        className="mb-6 text-xl"
                        style={{
                          fontFamily: "'Playfair Display', serif"
                        }}
                      >
                        Local Small Business Micro-Possibilities
                      </h2>

                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter target Zip Code..."
                        value={zipCode}
                        onChange={(event) =>
                          setZipCode(event.target.value)
                        }
                        className="mb-6 w-full max-w-sm rounded-xl border border-[#EBE7E0] bg-white px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#607264]"
                      />

                      <div className="rounded-2xl border border-dashed border-[#CFC8BE] bg-white/60 p-8 text-center">

                        <p className="text-sm text-[#5C574F]">
                          Interactive local scouting results will
                          populate here for Zip Code{" "}
                          <strong>{zipCode || "XXXXX"}</strong>.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "analytics" && (
                    <div className="h-full overflow-y-auto p-6">

                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#A34A4A]">
                        Live Platform Telemetry
                      </p>

                      <h2
                        className="mb-6 text-xl"
                        style={{
                          fontFamily: "'Playfair Display', serif"
                        }}
                      >
                        Real-Time User Performance Metrics
                      </h2>

                      <div className="grid gap-4 sm:grid-cols-2">

                        <div className="rounded-2xl border border-[#EBE7E0] bg-white p-6">

                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#7A756B]">
                            Active Session Duration
                          </span>

                          <strong className="text-3xl font-light text-[#2D2A26]">
                            {formatElapsedTime(elapsedTime)}
                          </strong>
                        </div>

                        <div className="rounded-2xl border border-[#EBE7E0] bg-white p-6">

                          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#7A756B]">
                            Calibration Breaks Triggered
                          </span>

                          <strong className="text-3xl font-light text-[#A34A4A]">
                            {pauseCount}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

