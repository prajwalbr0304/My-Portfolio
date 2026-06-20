"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  ArrowRight,
  Bot,
  Cpu,
  Mic,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { motionTransitions } from "@/lib/motion";
import { streamLocalOrchestration } from "../lib/local-orchestrator";
import { useCopilotStore } from "../store/copilot-store";
import { CopilotMarkdown } from "./copilot-markdown";

export function CopilotWorkspace() {
  const store = useCopilotStore();
  const [chatInput, setChatInput] = useState("");
  const [activeThought, setActiveThought] = useState("");
  const [, startTransition] = useTransition();
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const speechRecognition = useRef<any | null>(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [store.messages, store.isThinking, activeThought]);

  // Inline panel: scroll section into view after open
  useEffect(() => {
    if (!store.isOpen) return;
    const t = window.setTimeout(() => {
      document
        .getElementById("portfolio-assistant")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(t);
  }, [store.isOpen]);

  const handleClose = () => {
    if (speechRecognition.current && useCopilotStore.getState().isListening) {
      try {
        speechRecognition.current.stop();
      } catch {
        /* already stopped */
      }
    }
    store.setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRec =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const rec = new SpeechRec();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          store.setListening(true);
        };
        rec.onend = () => {
          store.setListening(false);
        };
        rec.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          if (text) {
            handleSendMessage(text);
          }
        };
        speechRecognition.current = rec;
      }
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!speechRecognition.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    if (store.isListening) {
      speechRecognition.current.stop();
    } else {
      speechRecognition.current.start();
    }
  };

  // Main chat submit handler
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    // Add user message
    store.addMessage({ role: "user", content: textToSend });
    setChatInput("");
    store.setThinking(true);
    setActiveThought("Preparing an answer from portfolio context…");

    startTransition(async () => {
      // 1. Try server streaming route first
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: store.messages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (res.ok && res.body && res.headers.get("X-AI-Mode") === "live") {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let currentContent = "";
          store.setThinking(false);
          setActiveThought("");

          // Seed assistant placeholder message
          const assistantMsgId = crypto.randomUUID();
          store.addMessage({ role: "assistant", content: "" });

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            currentContent += decoder.decode(value);

            // Directly update the last message in store
            useCopilotStore.setState((state) => {
              const updated = [...state.messages];
              if (updated.length > 0) {
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: currentContent,
                };
              }
              return { messages: updated };
            });
          }

          return;
        }
      } catch (err) {
        console.warn("Server edge AI failed, falling back to local orchestrator", err);
      }

      // 2. Local Fallback Simulation (Fully Offline Capable!)
      await streamLocalOrchestration(textToSend, (update) => {
        if (update.thought) {
          setActiveThought(update.thought);
        }
        if (update.chunk) {
          store.setThinking(false);
          useCopilotStore.setState((state) => {
            const updated = [...state.messages];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant" && last.isSimulated) {
              updated[updated.length - 1] = {
                ...last,
                content: update.chunk,
              };
            } else {
              updated.push({
                id: crypto.randomUUID(),
                role: "assistant",
                content: update.chunk,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSimulated: true,
              });
            }
            return { messages: updated };
          });
        }
      });

      // Clean thought block
      setActiveThought("");
    });
  };

  return (
    <AnimatePresence>
      {store.isOpen ? (
        <motion.div
          key="portfolio-ai-panel"
          role="region"
          aria-labelledby="portfolio-assistant-title"
          className="px-3 pb-8 pt-2 xs:px-4 xs:pb-10 xs:pt-4 md:px-6 md:pb-14 md:pt-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={motionTransitions.enter}
        >
          <div className="glass-strong noise flex h-[min(82vh,760px)] max-h-[min(82vh,760px)] min-h-[440px] w-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <Bot className="size-6 shrink-0 text-accent" aria-hidden />
                  <div className="min-w-0">
                    <h3 id="portfolio-assistant-title" className="truncate font-semibold text-foreground">
                      Portfolio assistant
                    </h3>
                    <p className="truncate text-xs text-muted-foreground sm:text-caption">
                      Ask me anything — general questions or all about Prajwal.
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="size-9 shrink-0 rounded-full p-0"
                  onClick={handleClose}
                  type="button"
                  aria-label="Close and return to top"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-3 p-4 sm:p-5">
                <div className="min-h-[180px] flex-1 space-y-4 overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface/30 p-4 scrollbar-thin">
                  {store.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex gap-3 ${
                        m.role === "user" ? "ml-auto max-w-[min(100%,28rem)] flex-row-reverse" : "max-w-full"
                      }`}
                    >
                      <div
                        className={`grid size-8 shrink-0 place-items-center rounded-full text-xs ${
                          m.role === "user"
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-surface-raised border border-border"
                        }`}
                      >
                        {m.role === "user" ? "ME" : <Bot className="size-4 text-accent" />}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            m.role === "user"
                              ? "border border-secondary/20 bg-secondary/15 text-foreground"
                              : "border border-border bg-card/90 text-foreground"
                          }`}
                        >
                          {m.role === "assistant" ? (
                            <CopilotMarkdown content={m.content} />
                          ) : (
                            <span className="whitespace-pre-wrap">{m.content}</span>
                          )}
                        </div>
                        <span className="block px-1 text-[10px] text-subtle">{m.timestamp}</span>
                      </div>
                    </div>
                  ))}

                  {store.isThinking && activeThought ? (
                    <div className="flex max-w-full gap-3">
                      <div className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-surface-raised">
                        <Cpu className="size-4 animate-spin text-accent" />
                      </div>
                      <div className="rounded-2xl border border-accent/20 bg-accent/5 px-4 py-2.5 font-mono text-xs leading-5 text-accent">
                        {activeThought}
                      </div>
                    </div>
                  ) : null}
                  <div ref={chatEndRef} />
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      "Summarize Prajwal's strongest projects",
                      "What’s in his GitHub / open source work?",
                      "Explain his Nokia internship in plain terms",
                      "How does he use AI in his portfolio?",
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        className="rounded-xl border border-border bg-surface px-3 py-2 text-left text-xs text-muted hover:border-secondary/40 hover:text-foreground transition"
                        onClick={() => handleSendMessage(prompt)}
                        type="button"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="relative mt-auto flex items-center">
                    <input
                      type="text"
                      placeholder="Ask about the portfolio, repos, stack, or experience…"
                      className="w-full rounded-full border border-border bg-surface px-5 py-3.5 pr-24 text-sm text-foreground focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage(chatInput)}
                    />
                    <div className="absolute right-2 flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
                        onClick={toggleSpeechRecognition}
                        title="Voice Input"
                      >
                        <Mic className={`size-4 ${store.isListening ? "text-accent animate-pulse" : "text-muted"}`} />
                      </Button>
                      <Button
                        className="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-secondary text-secondary-foreground"
                        onClick={() => handleSendMessage(chatInput)}
                      >
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </div>
              </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

