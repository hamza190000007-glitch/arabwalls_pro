import { Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { lockSite } from "@/lib/gate.functions";

export function AppHeader() {
  const router = useRouter();
  const lock = useServerFn(lockSite);
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-display text-3xl text-primary">حمزة</Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" className="nav-link" activeProps={{ className: "nav-link nav-active" }} activeOptions={{ exact: true }}>الخلفيات</Link>
          <Link to="/editor" search={{ bg: undefined }} className="nav-link" activeProps={{ className: "nav-link nav-active" }}>صانع الاقتباسات</Link>
          <button
            className="nav-link"
            onClick={async () => {
              await lock();
              await router.navigate({ to: "/unlock" });
            }}
          >
            قفل
          </button>
        </nav>
      </div>
    </header>
  );
}
