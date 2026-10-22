import type { Wallpaper } from "@/lib/wallpapers";

export function WallpaperThumb({ wp, className = "" }: { wp: Wallpaper; className?: string }) {
  return (
    <div className={`relative aspect-[9/16] w-full overflow-hidden ${className}`}>
      <img src={wp.src} alt={wp.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      {wp.fg && (
        <img
          src={wp.fg.src}
          alt=""
          loading="lazy"
          className="absolute bottom-0 max-h-[85%] object-contain object-bottom"
          style={{
            width: `${wp.fg.width * 100}%`,
            left: wp.fg.align === "left" ? 0 : wp.fg.align === "center" ? `${((1 - wp.fg.width) / 2) * 100}%` : undefined,
            right: wp.fg.align === "right" ? 0 : undefined,
          }}
        />
      )}
    </div>
  );
}
