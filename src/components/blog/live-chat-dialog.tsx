"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/admin/live-chat/chat-message";
import { ChatInput } from "@/components/admin/live-chat/chat-input";
import { TypingIndicator } from "@/components/admin/live-chat/typing-indicator";
import { useLiveChat } from "@/hooks/use-live-chat";
import { useVisitorId } from "@/hooks/use-visitor-id";
import type { TypingState } from "@/types/live-chat";

interface LiveChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  sourceUrl?: string;
  title?: string;
  description?: string;
}

export function LiveChatDialog({
  isOpen,
  onClose,
  postId,
  sourceUrl,
  title = "Chat with us",
  description = "We typically reply in a few minutes",
}: LiveChatDialogProps) {
  const visitorId = useVisitorId();
  const [consentGiven, setConsentGiven] = useState(false);

  const {
    conversation,
    messages,
    isLoading,
    sendMessage,
    adminTyping,
    setVisitorTyping,
    startConversation,
  } = useLiveChat({
    visitorId,
    postId,
    sourceUrl,
    consentGiven,
  });

  const isChatClosed = conversation?.status === "closed" || conversation?.status === "archived";

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, adminTyping]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-background w-full h-full sm:h-auto sm:max-h-[80vh] sm:max-w-md sm:rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-4 border-b border-border bg-primary text-primary-foreground">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-2 right-2 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 pr-8">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center border-2 border-primary-foreground/30">
                <span className="text-lg">💬</span>
              </div>
              <div>
                <h2 className="font-semibold">{title}</h2>
                <p className="text-sm text-primary-foreground/80">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1 min-h-64 max-h-96">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">👋</span>
                </div>
                <h3 className="font-medium mb-1">Start a conversation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Chat with one of our experts now.
                </p>
                {/* Privacy consent checkbox */}
                {!conversation && (
                  <label className="flex items-start gap-2 text-left text-sm cursor-pointer max-w-xs">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-muted-foreground">
                      I agree to the{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        className="text-primary underline hover:no-underline"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                )}
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </>
            )}

            {/* Admin typing indicator */}
            {adminTyping.isTyping && !isChatClosed && (
              <div className="flex items-start gap-2 mb-3">
                <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat closed indicator - no input, only close button available */}
          {isChatClosed ? (
            <div className="flex flex-col items-center justify-center py-6 text-center border-t border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">
                This conversation has been closed.
              </p>
            </div>
          ) : !conversation && !consentGiven ? (
            <div className="flex flex-col items-center justify-center py-4 text-center border-t border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">
                Please accept the Privacy Policy to start chatting.
              </p>
            </div>
          ) : (
            <ChatInput
              onSend={sendMessage}
              onTyping={setVisitorTyping}
              placeholder="Type your message..."
              showTypingText
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
