import { useCallback, useEffect, useState } from "react";
import type { MessageTag, SpotMessage } from "../types";
import { generateId, getDeviceId, getDeviceName } from "../utils/id";

const FAVORITES_KEY = "spotmessage:favorites";
const LAST_DROP_KEY = "spotmessage:lastDrop";
const RATE_LIMIT_MS = 15000;
const POLL_INTERVAL_MS = 8000;

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export interface NewMessageInput {
  lat: number;
  lng: number;
  title: string;
  text: string;
  tag: MessageTag;
  photo?: string;
  expiresAt: number | null;
}

type AddResult = { ok: true; message: SpotMessage } | { ok: false; reason: "rate_limited" | "empty" | "network" };

export function useMessages() {
  const [messages, setMessages] = useState<SpotMessage[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);
  const [lastDropAt, setLastDropAt] = useState<number>(() => Number(localStorage.getItem(LAST_DROP_KEY) || 0));
  const [now, setNow] = useState(Date.now());

  const deviceId = getDeviceId();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/messages");
      if (!res.ok) return;
      const data: SpotMessage[] = await res.json();
      setMessages(data);
    } catch {
      // background refresh failed (offline?) - keep last known state
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const cooldownRemaining = Math.max(0, RATE_LIMIT_MS - (now - lastDropAt));

  const addMessage = useCallback(
    async (input: NewMessageInput): Promise<AddResult> => {
      if (Date.now() - lastDropAt < RATE_LIMIT_MS) return { ok: false, reason: "rate_limited" };
      if (!input.text.trim()) return { ok: false, reason: "empty" };

      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: generateId(),
            authorId: deviceId,
            authorName: getDeviceName(),
            ...input,
          }),
        });
        if (!res.ok) return { ok: false, reason: "network" };
        const message: SpotMessage = await res.json();
        setMessages((prev) => [message, ...prev]);
        setLastDropAt(Date.now());
        localStorage.setItem(LAST_DROP_KEY, String(Date.now()));
        return { ok: true, message };
      } catch {
        return { ok: false, reason: "network" };
      }
    },
    [deviceId, lastDropAt],
  );

  const deleteMessage = useCallback(
    async (id: string) => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      try {
        await fetch(`/api/messages/${id}?authorId=${encodeURIComponent(deviceId)}`, { method: "DELETE" });
      } catch {
        refresh();
      }
    },
    [deviceId, refresh],
  );

  const toggleLike = useCallback(
    async (id: string) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== id) return m;
          const liked = m.likes.includes(deviceId);
          return { ...m, likes: liked ? m.likes.filter((l) => l !== deviceId) : [...m.likes, deviceId] };
        }),
      );
      try {
        const res = await fetch(`/api/messages/${id}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId }),
        });
        if (res.ok) {
          const updated: SpotMessage = await res.json();
          setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
        }
      } catch {
        // next poll reconciles state
      }
    },
    [deviceId],
  );

  const addComment = useCallback(
    async (id: string, text: string) => {
      const trimmed = text.trim().slice(0, 300);
      if (!trimmed) return;
      try {
        const res = await fetch(`/api/messages/${id}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: generateId(), authorId: deviceId, authorName: getDeviceName(), text: trimmed }),
        });
        if (res.ok) {
          const updated: SpotMessage = await res.json();
          setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
        }
      } catch {
        // ignore, next poll reconciles
      }
    },
    [deviceId],
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const reportMessage = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/messages/${id}/report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId }),
        });
      } finally {
        refresh();
      }
    },
    [deviceId, refresh],
  );

  return {
    messages,
    deviceId,
    favorites,
    addMessage,
    deleteMessage,
    toggleLike,
    addComment,
    toggleFavorite,
    reportMessage,
    cooldownRemaining,
  };
}
