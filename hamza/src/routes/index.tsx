import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { requireUnlocked } from "@/lib/gate.functions";
import { CATEGORIES, WALLPAPERS, type Wallpaper } from "@/lib/wallpapers";
import { useFavorites, downloadUrl } from "@/lib/favorites";
import { AppHeader } from "@/components/AppHeader";
import { WallpaperThumb } from "@/components/WallpaperThumb";
import { wallpaperDataUrl } from "@/lib/render";

export const Route = createFileRoute("/")({
  loader: () => requireUnlocked(),
  head: () => ({
    meta: [
      { title: "حمزة — خلفيات عربية" },
      { name: "description", content: "معرض خلفيات عربية مع المفضلة والتحميل بجودة كاملة." },
      { property: "og:title", content: "حمزة — خلفيات عربية" },
      { property: "og:description", content: "معرض خلفيات عربية مع المفضلة والتحميل." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [cat, setCat] = useState<string>("الكل");
  const [open, setOpen] = useState<Wallpaper | null>(null);
  const { favs, toggle } = useFavorites();
  const tabs = [...CATEGORIES, "المفضلة"];
  const list = WALLPAPERS.filter((w) =>
    cat === "الكل" ? true : cat === "المفضلة" ? favs.includes(w.id) : w.category === cat,
  );

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t} onClick={() => setCat(t)} className={t === cat ? "chip chip-active" : "chip"}>
              {t}
              {t === "المفضلة" && favs.length > 0 && ` (${favs.length})`}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">لا توجد خلفيات هنا بعد.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {list.map((w) => (
              <div key={w.id} className="group relative overflow-hidden rounded-xl border border-border">
                <button onClick={() => setOpen(w)} className="block w-full">
                  <WallpaperThumb wp={w} className="transition duration-500 group-hover:scale-105" />
                </button>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                  <p className="text-sm">{w.title}{w.fg && " ✦"}</p>
                </div>
                <button
                  onClick={() => toggle(w.id)}
                  aria-label="مفضلة"
                  className="absolute top-2 left-2 rounded-full bg-background/70 px-2.5 py-1 text-lg text-primary"
                >
                  {favs.includes(w.id) ? "♥" : "♡"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {open && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-background/90 p-4" onClick={() => setOpen(null)}>
          <div className="flex max-h-full flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="h-[75vh] aspect-[9/16] max-w-full overflow-hidden rounded-xl border border-border shadow-glow"><WallpaperThumb wp={open} /></div>
            <div className="flex flex-wrap justify-center gap-2">
              <button className="btn-gold" onClick={async () => downloadUrl(await wallpaperDataUrl(open), `hamza-${open.id}.jpg`)}>تحميل</button>
              <button className="chip" onClick={() => toggle(open.id)}>{favs.includes(open.id) ? "♥ في المفضلة" : "♡ أضف للمفضلة"}</button>
              <Link to="/editor" search={{ bg: open.id }} className="chip">اكتب عليها / قياس هاتفك أو ساعتك</Link>
              <button className="chip" onClick={() => setOpen(null)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
