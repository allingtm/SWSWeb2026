"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ChatConversation } from "@/types/live-chat";

interface UseChatNotificationsReturn {
  newChat: ChatConversation | null;
  dismissNotification: () => void;
}

export function useChatNotifications(): UseChatNotificationsReturn {
  const [newChat, setNewChat] = useState<ChatConversation | null>(null);
  const faviconIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Favicon flashing
  useEffect(() => {
    if (newChat) {
      let isOriginal = true;
      const originalFavicon = "/favicon.png";
      const alertFavicon = "/favicon-alert.svg";

      faviconIntervalRef.current = setInterval(() => {
        const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (link) {
          link.href = isOriginal ? alertFavicon : originalFavicon;
          isOriginal = !isOriginal;
        }
      }, 500);

      return () => {
        if (faviconIntervalRef.current) {
          clearInterval(faviconIntervalRef.current);
          // Restore original favicon
          const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
          if (link) link.href = originalFavicon;
        }
      };
    }
  }, [newChat]);

  // Subscribe to new conversations
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-chat-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sws2026_chat_conversations",
        },
        (payload) => {
          const conversation = payload.new as ChatConversation;
          setNewChat(conversation);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const dismissNotification = useCallback(() => {
    setNewChat(null);
  }, []);

  return { newChat, dismissNotification };
}
