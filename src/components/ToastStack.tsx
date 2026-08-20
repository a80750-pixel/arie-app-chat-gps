import type { Toast } from "../hooks/useToasts";

export default function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[1000] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast-in rounded-full px-4 py-2 text-sm font-medium shadow-lg"
          style={{ background: "var(--text)", color: "var(--bg)" }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
