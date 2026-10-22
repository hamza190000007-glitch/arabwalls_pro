import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { unlockSite } from "@/lib/gate.functions";

export const Route = createFileRoute("/unlock")({
  head: () => ({
    meta: [
      { title: "حمزة — دخول" },
      { name: "description", content: "تطبيق حمزة الخاص للخلفيات والاقتباسات العربية." },
      { property: "og:title", content: "حمزة — دخول" },
      { property: "og:description", content: "تطبيق خاص للخلفيات والاقتباسات العربية." },
    ],
  }),
  component: Unlock,
});

function Unlock() {
  const router = useRouter();
  const unlock = useServerFn(unlockSite);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const password = new FormData(e.currentTarget).get("password") as string;
    const { ok } = await unlock({ data: { password } });
    setBusy(false);
    if (ok) await router.navigate({ to: "/" });
    else setError(true);
  }

  return (
    <main className="hero-bg flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-border bg-card/80 p-8 text-center shadow-glow backdrop-blur">
        <h1 className="font-display text-6xl text-primary">حمزة</h1>
        <p className="mt-2 text-muted-foreground">خلفيات واقتباسات عربية — نسخة خاصة</p>
        <input
          name="password"
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          placeholder="كلمة المرور"
          className="mt-8 w-full rounded-lg border border-input bg-background px-4 py-3 text-center text-lg outline-none focus:ring-2 focus:ring-ring"
        />
        {error && <p className="mt-3 text-sm text-destructive">كلمة المرور غير صحيحة</p>}
        <button type="submit" disabled={busy} className="btn-gold mt-6 w-full">{busy ? "..." : "دخول"}</button>
      </form>
    </main>
  );
}
