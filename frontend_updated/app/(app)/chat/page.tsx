"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Sparkles, Send, Bot, User, MessagesSquare } from "lucide-react";
import { PageHeader } from "@/components/domain/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { EmptyState } from "@/components/domain/empty-state";
import { useRecruiterChat } from "@/lib/hooks/use-api";
import { useSessionStore } from "@/lib/store/session-store";
import { ApiError } from "@/lib/api/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Why is the top candidate ranked highest?",
  "Who has the strongest future potential?",
  "Compare the top 3 candidates briefly",
  "Which candidates have the biggest risks?",
];

export default function ChatPage() {
  const { parsedJD, candidates, rankings } = useSessionStore();
  const { mutate, isPending } = useRecruiterChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  function handleSend(question?: string) {
    const finalQuestion = (question ?? input).trim();
    if (!finalQuestion) return;
    if (!parsedJD || candidates.length === 0) {
      toast.error("Parse a JD and load candidates before chatting.");
      return;
    }

    setMessages((m) => [...m, { role: "user", content: finalQuestion }]);
    setInput("");

    mutate(
      { parsedJd: parsedJD, candidates, question: finalQuestion },
      {
        onSuccess: (data) => {
          setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
        },
        onError: (err) => {
          const message = err instanceof ApiError ? err.detail : "The recruiter AI couldn't respond.";
          toast.error(message);
          setMessages((m) => m.slice(0, -1));
        },
      }
    );
  }

  const ready = parsedJD && candidates.length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)]">
      <PageHeader
        eyebrow="Recruiter AI"
        title="Ask your hiring copilot"
        description="Grounded in your parsed job description and full candidate pool — ask about rankings, risks, and comparisons."
        className="mb-4"
      />

      {!ready ? (
        <EmptyState
          icon={MessagesSquare}
          title={!parsedJD ? "Parse a job description first" : "Load a candidate pool first"}
          description="The recruiter AI needs a parsed JD and candidates to reason about before it can answer questions."
          action={
            <Button asChild size="sm" variant="secondary">
              <Link href={!parsedJD ? "/jd-parser" : "/ranking"}>
                {!parsedJD ? "Parse a JD" : "Load candidates"}
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <Card className="flex-1 overflow-y-auto p-6 space-y-5 mb-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary-muted text-primary">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <p className="font-medium">Ready when you are</p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Grounded in {candidates.length} candidates ranked against{" "}
                    {parsedJD?.title ?? "your job description"}.
                    {rankings.length === 0 &&
                      " Tip: run a ranking first for richer, score-aware answers."}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 max-w-md">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, i) => (
              <ChatBubble key={i} message={message} />
            ))}

            {isPending && (
              <div className="flex gap-3">
                <Avatar role="assistant" />
                <div className="flex items-center gap-1 rounded-xl bg-muted/60 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 rounded-full bg-muted-foreground animate-pulse"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </Card>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            <Textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about your ranked candidates..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

function Avatar({ role }: { role: "user" | "assistant" }) {
  return (
    <div
      className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
        role === "assistant"
          ? "bg-primary-muted text-primary"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {role === "assistant" ? <Bot className="size-4" /> : <User className="size-4" />}
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar role={message.role} />
      <div
        className={`max-w-[75%] rounded-xl px-4 py-3 text-sm ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted/60 text-foreground"
        }`}
      >
        {isUser ? (
          message.content
        ) : (
          <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-ul:my-2">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
