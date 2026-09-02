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
    "[Your revised Master Resume will generate here...]"
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
          content="A private, supportive digital sanctuary designed to help you uncover your professional strengths and confidently move toward your next opportunity."
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="flex h-screen flex-col"
        style={{
          backgroundColor: "#FBF9F6",
          color: "#2D2A26"
        }}
      >
        <Navbar />

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {!hasStarted ? (
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-8">
              <div className="mx-auto max-w-2xl rounded-3xl border border-[#EBE7E0] bg-white/40 px-6 py-12 text-center shadow-sm">

                <h1
                  className="mb-6 text-4xl font-light tracking-wide text-[#2D2A26] sm:text-5xl"
                  style={{
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  Alighned Path
                </h1>

                <div className="mx-auto mb-8 h-px w-12 bg-[#607264]" />

                <p className="mx-auto mb-10 max-w-lg text-sm italic leading-relaxed text-[#5C574F] sm:text-base">
                  A private, supportive digital sanctuary designed to
                  help you uncover your strengths, reposition your
                  professional experience, and move toward your next
                  opportunity with greater clarity.
                </p>

                <button
                  type="button"
                  onClick={() => setHasStarted(true)}
                  className="rounded-full bg-[#607264] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#4D5C50]"
                >
                  Step onto your path
                </button>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-4 overflow-hidden px-4 py-4 md:flex-row">

              <aside className="hidden w-72 flex-shrink-0 md:block">
                <div className="rounded-2xl border border-[#EBE7E0] bg-white/50 p-4">

                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#607264]">
                    Workspace Navigation
                  </p>

                  <div className="space-y-1">

                    <button
                      type="button"
                      onClick={() => setActiveTab("chat")}
                      className={`w-full rounded-xl px-4 py-3 text-left text-xs font-semibold ${
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
                      className={`w-full rounded-xl px-4 py-3 text-left text-xs font-semibold ${
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
                      className={`w-full rounded-xl px-4 py-3 text-left text-xs font-semibold ${
                        activeTab === "matches"
                          ? "bg-[#607264] text-white"
                          : "text-[#5C574F] hover:bg-white"
                      }`}
                    >
                      Top Job Titles
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("optimizer")}
                      className={`w-full rounded-xl px-4 py-3 text-left text-xs font-semibold ${
                        activeTab === "optimizer"
                          ? "bg-[#607264] text-white"
                          : "text-[#5C574F] hover:bg-white"
                      }`}
                    >
                      LinkedIn &amp; Indeed
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("local")}
                      className={`w-full rounded-xl px-4 py-3 text-left text-xs font-semibold ${
                        activeTab === "local"
                          ? "bg-[#607264] text-white"
                          : "text-[#5C574F] hover:bg-white"
                      }`}
                    >
                      Local Opportunities
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("analytics")}
                      className={`w-full rounded-xl px-4 py-3 text-left text-xs font-semibold ${
                        activeTab === "analytics"
                          ? "bg-[#A34A4A] text-white"
                          : "text-[#A34A4A] hover:bg-white"
                      }`}
                    >
                      Analytics
                    </button>

                  </div>
                </div>
              </aside>

              <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-[#EBE7E0] bg-white/60">

                <div className="flex flex-shrink-0 overflow-x-auto border-b border-[#EBE7E0] md:hidden">

                  {[
                    ["chat", "Chat"],
                    ["resume", "Resume"],
                    ["matches", "Titles"],
                    ["optimizer", "Social"],
                    ["local", "Local"],
                    ["analytics", "Metrics"]
                  ].map(([tab, label]) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() =>
                        setActiveTab(
                          tab as
                            | "chat"
                            | "resume"
                            | "matches"
                            | "optimizer"
                            | "local"
                            | "analytics"
                        )
                      }
                      className={`whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase ${
                        activeTab === tab
                          ? "border-b-2 border-[#607264] text-[#607264]"
                          : "text-[#7A756B]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}

                </div>

                {activeTab === "chat" && (
                  <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

                    <div className="min-h-0 flex-1 overflow-hidden">
                      <Chat
                        messages={messages}
                        loading={loading}
                        onSend={handleSend}
                        onReset={handleReset}
                      />
                    </div>

                    <div className="flex flex-shrink-0 items-center justify-between border-t border-[#EBE7E0] bg-white px-4 py-2">

                      <span className="text-[10px] uppercase tracking-widest text-[#7A756B]">
                        Session {formatElapsedTime(elapsedTime)}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setPauseCount((count) => count + 1)
                        }
                        className="rounded-full bg-[#F9ECEC] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#A34A4A]"
                      >
                        Calibration Pause
                      </button>
                    </div>

                    <div ref={messagesEndRef} />
                  </div>
                )}

                {activeTab === "resume" && (
                  <div className="min-h-0 flex-1 overflow-y-auto p-6">

                    <h2 className="mb-6 text-xl font-semibold">
                      Resume Dressing Room
                    </h2>

                    <div className="grid gap-6 lg:grid-cols-2">

                      <div>
                        <h3 className="mb-2 text-sm font-semibold">
                          Current Resume
                        </h3>

                        <textarea
                          value={oldResume}
                          onChange={(event) =>
                            setOldResume(event.target.value)
                          }
                          className="min-h-[350px] w-full rounded-xl border border-[#EBE7E0] p-4 text-sm outline-none"
                        />
                      </div>

                      <div>
                        <h3 className="mb-2 text-sm font-semibold">
                          Revised Resume
                        </h3>

                        <textarea
                          value={revisedResume}
                          onChange={(event) =>
                            setRevisedResume(event.target.value)
                          }
                          className="min-h-[350px] w-full rounded-xl border border-[#EBE7E0] p-4 text-sm outline-none"
                        />
                      </div>

                    </div>
                  </div>
                )}

                {activeTab === "matches" && (
                  <div className="min-h-0 flex-1 overflow-y-auto p-6">

                    <h2 className="mb-6 text-xl font-semibold">
                      High-Value Target Roles
                    </h2>

                    <div className="space-y-4">

                      <div className="rounded-xl border border-[#EBE7E0] bg-white p-5">
                        <h3 className="font-semibold">
                          Operations Management Director
                        </h3>

                        <p className="mt-2 text-sm text-[#5C574F]">
                          Operational leadership, scheduling,
                          cross-functional coordination and crisis
                          management.
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#EBE7E0] bg-white p-5">
                        <h3 className="font-semibold">
                          Customer Success Strategic Account Lead
                        </h3>

                        <p className="mt-2 text-sm text-[#5C574F]">
                          Client escalation management, retention,
                          communication and account leadership.
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#EBE7E0] bg-white p-5">
                        <h3 className="font-semibold">
                          Corporate Training &amp; Onboarding Lead
                        </h3>

                        <p className="mt-2 text-sm text-[#5C574F]">
                          Training, mentoring and development of
                          operational personnel.
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {activeTab === "optimizer" && (
                  <div className="min-h-0 flex-1 overflow-y-auto p-6">

                    <h2 className="mb-6 text-xl font-semibold">
                      LinkedIn &amp; Indeed Studio
                    </h2>

                    <div className="space-y-4">

                      <div className="rounded-xl border border-[#EBE7E0] bg-white p-5">
                        <h3 className="font-semibold">
                          LinkedIn Headline
                        </h3>

                        <p className="mt-2 text-sm text-[#5C574F]">
                          Operations Specialist | Cross-Functional
                          Leadership | Revenue Protection | Client
                          Experience
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#EBE7E0] bg-white p-5">
                        <h3 className="font-semibold">
                          Indeed Profile
                        </h3>

                        <p className="mt-2 text-sm text-[#5C574F]">
                          Optimize experience, accomplishments and
                          keywords for recruiter search and automated
                          screening.
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {activeTab === "local" && (
                  <div className="min-h-0 flex-1 overflow-y-auto p-6">

                    <h2 className="mb-6 text-xl font-semibold">
                      Local Opportunity Search
                    </h2>

                    <input
                      type="text"
                      value={zipCode}
                      onChange={(event) =>
                        setZipCode(event.target.value)
                      }
                      placeholder="Enter ZIP Code"
                      className="w-full max-w-sm rounded-xl border border-[#EBE7E0] bg-white px-4 py-3 text-sm outline-none"
                    />

                    <div className="mt-6 rounded-xl border border-dashed border-[#CFC8BE] p-8">
                      <p className="text-sm text-[#5C574F]">
                        Local opportunity results will appear here for
                        ZIP Code {zipCode || "XXXXX"}.
                      </p>
                    </div>

                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="min-h-0 flex-1 overflow-y-auto p-6">

                    <h2 className="mb-6 text-xl font-semibold">
                      Session Analytics
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div className="rounded-xl border border-[#EBE7E0] bg-white p-6">

                        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7A756B]">
                          Session Duration
                        </p>

                        <p className="mt-2 text-3xl">
                          {formatElapsedTime(elapsedTime)}
                        </p>

                      </div>

                      <div className="rounded-xl border border-[#EBE7E0] bg-white p-6">

                        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7A756B]">
                          Calibration Pauses
                        </p>

                        <p className="mt-2 text-3xl text-[#A34A4A]">
                          {pauseCount}
                        </p>

                      </div>

                    </div>
                  </div>
                )}

              </section>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
