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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const faviconIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check authentication status
  useEffect(() => {
    const supabase = createClient();

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  // Subscribe to new conversations (only when authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;

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
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Admin chat notifications: subscribed to new conversations");
        } else if (status === "CHANNEL_ERROR") {
          console.error("Admin chat notifications: subscription error");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const dismissNotification = useCallback(() => {
    setNewChat(null);
  }, []);

  return { newChat, dismissNotification };
}
