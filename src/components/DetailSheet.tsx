import { useState } from "react";
import { X, Lock, Heart, MessageCircle, Share2, Navigation2, Trash2, Flag, Star } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import type { SpotMessage } from "../types";
import { formatDistance } from "../utils/format";
import { UNLOCK_RADIUS_METERS } from "../utils/haversine";

interface DetailSheetProps {
  message: SpotMessage;
  distance: number;
  locked: boolean;
  deviceId: string;
  favorite: boolean;
  onClose: () => void;
  onToggleLike: () => void;
  onAddComment: (text: string) => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onReport: () => void;
  onShare: () => void;
}

const TAG_LABEL_KEY: Record<string, string> = {
  memory: "compose.tagMemory",
  review: "compose.tagReview",
  message: "compose.tagMessage",
  clue: "compose.tagClue",
};

export default function DetailSheet({
  message,
  distance,
  locked,
  deviceId,
  favorite,
  onClose,
  onToggleLike,
  onAddComment,
  onToggleFavorite,
  onDelete,
  onReport,
  onShare,
}: DetailSheetProps) {
  const { t } = useI18n();
  const [commentText, setCommentText] = useState("");
  const isOwner = message.authorId === deviceId;
  const liked = message.likes.includes(deviceId);

  const progress = Math.max(0, Math.min(1, 1 - (distance - UNLOCK_RADIUS_METERS) / 200));

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${message.lat},${message.lng}&travelmode=walking`;

  return (
    <div className="fixed inset-0 z-[1100] flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-2xl p-4 sm:rounded-2xl"
        style={{ background: "var(--bg-elevated)", color: "var(--text)", boxShadow: "var(--shadow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ background: "var(--bg-elevated-2)", color: "var(--text-muted)" }}
          >
            {t(TAG_LABEL_KEY[message.tag] as never)}
          </span>
          <button type="button" onClick={onClose} aria-label={t("detail.close")}>
            <X size={20} />
          </button>
        </div>

        {locked ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "var(--bg-elevated-2)", color: "var(--locked)" }}
            >
              <Lock size={28} />
            </div>
            <p className="mb-1 font-semibold">{t("pin.locked")}</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {distance <= 40
                ? t("pin.lockedVeryClose")
                : t("pin.lockedDistance", { distance: formatDistance(distance, t("common.meters")) })}
            </p>
            <div className="mt-4 h-2 w-full max-w-[220px] overflow-hidden rounded-full" style={{ background: "var(--bg-elevated-2)" }}>
              <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: "var(--locked)" }} />
            </div>
          </div>
        ) : (
          <>
            {message.title && <h2 className="mb-1 text-lg font-semibold">{message.title}</h2>}
            <p className="mb-2 text-xs" style={{ color: "var(--text-muted)" }}>
              {t("detail.by")} {message.authorName} · {new Date(message.createdAt).toLocaleDateString()}
            </p>
            {message.photo && (
              <img src={message.photo} alt="" className="mb-3 max-h-64 w-full rounded-lg object-cover" />
            )}
            <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onToggleLike}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{ background: "var(--bg-elevated-2)", color: liked ? "var(--danger)" : "var(--text)" }}
              >
                <Heart size={14} fill={liked ? "currentColor" : "none"} />
                {message.likes.length} {t("detail.likes")}
              </button>

              <button
                type="button"
                onClick={onToggleFavorite}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{ background: "var(--bg-elevated-2)", color: favorite ? "#facc15" : "var(--text)" }}
                title={favorite ? t("detail.unfavorite") : t("detail.favorite")}
              >
                <Star size={14} fill={favorite ? "currentColor" : "none"} />
              </button>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{ background: "var(--bg-elevated-2)", color: "var(--text)" }}
              >
                <Navigation2 size={14} />
                {t("detail.directions")}
              </a>

              <button
                type="button"
                onClick={onShare}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{ background: "var(--bg-elevated-2)", color: "var(--text)" }}
              >
                <Share2 size={14} />
                {t("detail.share")}
              </button>

              {isOwner ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(t("detail.deleteConfirm"))) onDelete();
                  }}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                  style={{ background: "var(--bg-elevated-2)", color: "var(--danger)" }}
                >
                  <Trash2 size={14} />
                  {t("detail.delete")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(t("detail.reportConfirm"))) onReport();
                  }}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                  style={{ background: "var(--bg-elevated-2)", color: "var(--text-muted)" }}
                >
                  <Flag size={14} />
                  {t("detail.report")}
                </button>
              )}
            </div>

            <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                <MessageCircle size={14} />
                {message.comments.length} {t("detail.comments")}
              </p>
              <div className="mb-2 flex flex-col gap-2 max-h-40 overflow-y-auto">
                {message.comments.map((c) => (
                  <div key={c.id} className="rounded-lg px-2.5 py-1.5 text-sm" style={{ background: "var(--bg-elevated-2)" }}>
                    <span className="font-medium">{c.authorName}: </span>
                    {c.text}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t("detail.commentPlaceholder")}
                  className="flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none"
                  style={{ background: "var(--bg-elevated-2)", borderColor: "var(--border)" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && commentText.trim()) {
                      onAddComment(commentText);
                      setCommentText("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (commentText.trim()) {
                      onAddComment(commentText);
                      setCommentText("");
                    }
                  }}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium"
                  style={{ background: "var(--accent)", color: "var(--accent-contrast)" }}
                >
                  {t("detail.sendComment")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
