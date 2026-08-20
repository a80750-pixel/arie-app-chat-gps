export type Lang = "fr" | "en" | "he";

export type Theme = "light" | "dark";

export type MessageTag = "memory" | "review" | "message" | "clue";

export interface Coords {
  lat: number;
  lng: number;
}

export interface SpotMessage {
  id: string;
  authorId: string;
  authorName: string;
  lat: number;
  lng: number;
  title: string;
  text: string;
  tag: MessageTag;
  photo?: string;
  createdAt: number;
  expiresAt: number | null;
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: number;
}

export interface GeoState {
  coords: Coords | null;
  accuracy: number | null;
  status: "idle" | "locating" | "active" | "denied" | "error" | "unsupported";
  errorMessage: string | null;
}
