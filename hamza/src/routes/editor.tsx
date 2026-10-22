import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { requireUnlocked } from "@/lib/gate.functions";
import { WALLPAPERS, QUOTE_CATEGORIES, FONTS, DEVICES, type Device } from "@/lib/wallpapers";
import { downloadUrl } from "@/lib/favorites";
import { renderWallpaper, type OverlayImageOpts } from "@/lib/render";
import { AppHeader } from "@/components/AppHeader";
import { WallpaperThumb } from "@/components/WallpaperThumb";

export const Route = createFileRoute("/editor")({
    validateSearch: (s: Record<string, unknown>) => ({ bg: typeof s["bg"] === "string" ? (s["bg"] as string) : undefined }),
    loader: () => requireUnlocked(),
    head: () => ({
        meta: [
            { title: "حمزة — صانع الخلفيات والدمج Pro" },
            { name: "description", content: "صمم وادمج صور فوق بعضها مع نصوص ثلاثية الأبعاد بدقة فائقة لكافة الهواتف والساعات." },
        ],
    }),
    component: Editor,
});

function Editor() {
    const { bg } = Route.useSearch();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputBgRef = useRef<HTMLInputElement>(null);
    const fileInputOverlayRef = useRef<HTMLInputElement>(null);
    const dragging = useRef(false);

    // التحكم بالعنصر النشط للسحب باللمس أو الماوس
    const [activeDragItem, setActiveDragItem] = useState<"text" | "overlay">("text");

    // الخلفية الأساسية والجهاز
    const [bgId, setBgId] = useState<string>(bg ?? WALLPAPERS[0]!.id);
    const [customBg, setCustomBg] = useState<string | null>(null);
    const [deviceId, setDeviceId] = useState<string>(DEVICES[0]!.id);
    const [deviceTab, setDeviceTab] = useState<"phone" | "watch" | "uhd">("phone");

    // بيانات النص
    const [text, setText] = useState<string>("حمزة");
    const [font, setFont] = useState<string>(FONTS[1]!.family);
    const [size, setSize] = useState(24);
    const [color, setColor] = useState("#ffffff");
    const [strokeColor, setStrokeColor] = useState<string>("gold");
    const [strokeWidth, setStrokeWidth] = useState<number>(3);
    const [textPos, setTextPos] = useState({ x: 0.5, y: 0.22 });
    const [textBehind, setTextBehind] = useState(true);

    // بيانات الصورة المضافة فوق الخلفية (Overlay / Picture on Picture)
    const [overlaySrc, setOverlaySrc] = useState<string | null>(null);
    const [overlayPos, setOverlayPos] = useState({ x: 0.5, y: 0.58 });
    const [overlayScale, setOverlayScale] = useState(0.45);
    const [overlayRotation, setOverlayRotation] = useState(0);
    const [overlayOpacity, setOverlayOpacity] = useState(1);
    const [overlayShape, setOverlayShape] = useState<"rect" | "circle" | "rounded">("circle");
    const [overlayBorderColor, setOverlayBorderColor] = useState<string>("gold");
    const [overlayBorderWidth, setOverlayBorderWidth] = useState<number>(4);
    const [overlayShadow, setOverlayShadow] = useState(true);
    const [overlayBlend, setOverlayBlend] = useState<GlobalCompositeOperation>("source-over");
    const [overlayBehindLandmark, setOverlayBehindLandmark] = useState(false);

    // المؤثرات البصرية
    const [dim, setDim] = useState(10);
    const [blur, setBlur] = useState(0);
    const [vignette, setVignette] = useState(true);
    const [goldenWarmth, setGoldenWarmth] = useState(15);
    const [gradientOverlay, setGradientOverlay] = useState<"none" | "bottom" | "top" | "both">("both");
    const [previewLock, setPreviewLock] = useState(false);
    const [watermark, setWatermark] = useState(false);
    const [quoteTab, setQuoteTab] = useState<keyof typeof QUOTE_CATEGORIES>("azkar");

    const wp = WALLPAPERS.find((w) => w.id === bgId) ?? WALLPAPERS[0]!;
    const device = DEVICES.find((d) => d.id === deviceId) ?? DEVICES[0]!;

    const getStrokeValue = (choice: string) => {
        if (choice === "gold") return "oklch(0.82 0.12 85)";
        if (choice === "black") return "#000000";
        if (choice === "white") return "#ffffff";
        return "";
    };

    useEffect(() => {
        if (canvasRef.current) {
            const overlayOpts: OverlayImageOpts | undefined = overlaySrc
                ? {
                    src: overlaySrc,
                    x: overlayPos.x,
                    y: overlayPos.y,
                    scale: overlayScale,
                    rotation: overlayRotation,
                    opacity: overlayOpacity,
                    shape: overlayShape,
                    borderColor: getStrokeValue(overlayBorderColor),
                    borderWidth: overlayBorderWidth,
                    shadow: overlayShadow,
                    blendMode: overlayBlend,
                    behindLandmark: overlayBehindLandmark,
                }
                : undefined;

            renderWallpaper(canvasRef.current, {
                wp,
                customImgSrc: customBg || undefined,
                W: device.w,
                H: device.h,
                dim,
                blur,
                vignette,
                goldenWarmth,
                gradientOverlay,
                watermark,
                text: {
                    text,
                    font,
                    size,
                    color,
                    strokeColor: getStrokeValue(strokeColor),
                    strokeWidth,
                    shadowBlur: 20,
                    x: textPos.x,
                    y: textPos.y,
                    behind: textBehind,
                },
                overlay: overlayOpts,
            });
        }
    }, [
        wp,
        customBg,
        device,
        text,
        font,
        size,
        color,
        strokeColor,
        strokeWidth,
        textPos,
        textBehind,
        overlaySrc,
        overlayPos,
        overlayScale,
        overlayRotation,
        overlayOpacity,
        overlayShape,
        overlayBorderColor,
        overlayBorderWidth,
        overlayShadow,
        overlayBlend,
        overlayBehindLandmark,
        dim,
        blur,
        vignette,
        goldenWarmth,
        gradientOverlay,
        watermark,
    ]);

    // التحكم بالسحب الحي على الشاشة
    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!dragging.current) return;
        const r = e.currentTarget.getBoundingClientRect();
        const nx = Math.min(0.98, Math.max(0.02, (e.clientX - r.left) / r.width));
        const ny = Math.min(0.98, Math.max(0.02, (e.clientY - r.top) / r.height));

        if (activeDragItem === "text") {
            setTextPos({ x: nx, y: ny });
        } else if (activeDragItem === "overlay") {
            setOverlayPos({ x: nx, y: ny });
        }
    };

    // رفع صورة فوق الخلفية
    const handleUploadOverlay = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                if (typeof evt.target?.result === "string") {
                    setOverlaySrc(evt.target.result);
                    setActiveDragItem("overlay"); // تحويل السحب للصورة تلقائياً
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // رفع خلفية كاملة خاصة
    const handleUploadBg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                if (typeof evt.target?.result === "string") {
                    setCustomBg(evt.target.result);
                    setTextBehind(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredDevices = DEVICES.filter((d) => d.kind === deviceTab);

    return (
        <div className="min-h-screen pb-16">
            <AppHeader />
            <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_440px]">
                {/* منطقة المعاينة المباشرة */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                        <div
                            className={device.kind === "watch" ? "watch-frame" : "phone-frame"}
                            style={{ borderRadius: device.round ? "9999px" : undefined }}
                        >
                            <canvas
                                ref={canvasRef}
                                onPointerDown={(e) => {
                                    dragging.current = true;
                                    e.currentTarget.setPointerCapture(e.pointerId);
                                    handlePointerMove(e);
                                }}
                                onPointerMove={handlePointerMove}
                                onPointerUp={() => (dragging.current = false)}
                                className="block h-auto w-full cursor-grab touch-none active:cursor-grabbing"
                                style={{ borderRadius: device.round ? "9999px" : undefined }}
                            />

                            {/* محاكاة شاشة القفل */}
                            {previewLock && (
                                <div
                                    className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-6 text-white"
                                    style={{ borderRadius: device.round ? "9999px" : undefined }}
                                >
                                    <div className="flex flex-col items-center pt-8">
                                        <span className="text-sm font-light tracking-wide opacity-90">الخميس، ٢٢ أكتوبر</span>
                                        <span className="font-mono text-6xl font-extralight tracking-tight drop-shadow-md">09:41</span>
                                        <span className="mt-1 text-xs text-amber-200/90">١٠ جمادى الأولى ١٤٤٨ هـ</span>
                                    </div>
                                    {device.kind === "phone" && (
                                        <div className="flex w-full items-center justify-between px-4 pb-4 opacity-80">
                                            <span className="rounded-full bg-black/40 p-3 text-lg backdrop-blur">🔦</span>
                                            <span className="rounded-full bg-black/40 p-3 text-lg backdrop-blur">📷</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* مفتاح تحديد العنصر المسحوب */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <span className="text-xs text-muted-foreground">أنت تحرك الآن:</span>
                        <button
                            onClick={() => setActiveDragItem("text")}
                            className={activeDragItem === "text" ? "chip chip-active text-xs" : "chip text-xs"}
                        >
                            ✍️ النص
                        </button>
                        {overlaySrc && (
                            <button
                                onClick={() => setActiveDragItem("overlay")}
                                className={activeDragItem === "overlay" ? "chip chip-active text-xs" : "chip text-xs"}
                            >
                                🖼️ الصورة المضافة
                            </button>
                        )}
                        <button
                            onClick={() => setPreviewLock(!previewLock)}
                            className={previewLock ? "chip chip-active text-xs" : "chip text-xs"}
                        >
                            {previewLock ? "إخفاء شاشة القفل" : "معاينة شاشة القفل 👁️"}
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        المقاس الحالي: {device.w} × {device.h} بكسل ({device.name})
                    </p>
                </div>

                {/* لوحة الأدوات والتعديل */}
                <aside className="space-y-6 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur">
                    {/* مقاسات وشاشات الهواتف والساعات */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="field-label mb-0 font-bold text-foreground">نوع الشاشة والمقاس</span>
                            <div className="flex gap-1">
                                <button onClick={() => setDeviceTab("phone")} className={deviceTab === "phone" ? "chip chip-active text-xs" : "chip text-xs"}>هواتف 📱</button>
                                <button onClick={() => setDeviceTab("watch")} className={deviceTab === "watch" ? "chip chip-active text-xs" : "chip text-xs"}>ساعات ⌚</button>
                                <button onClick={() => setDeviceTab("uhd")} className={deviceTab === "uhd" ? "chip chip-active text-xs" : "chip text-xs"}>4K 🖥️</button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {filteredDevices.map((d) => (
                                <button
                                    key={d.id}
                                    onClick={() => {
                                        setDeviceId(d.id);
                                        if (d.kind === "watch") {
                                            setTextPos({ x: 0.5, y: 0.28 });
                                            setOverlayPos({ x: 0.5, y: 0.65 });
                                        }
                                    }}
                                    className={d.id === deviceId ? "chip chip-active text-xs font-semibold" : "chip text-xs"}
                                >
                                    {d.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 🌟 ميزة إدراج صورة فوق صورة وتحريرها */}
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                                🖼️ إدراج صورة فوق الخلفية (صورة ثانية / ملصق)
                            </span>
                            {overlaySrc && (
                                <button
                                    onClick={() => setOverlaySrc(null)}
                                    className="text-xs text-destructive hover:underline cursor-pointer"
                                >
                                    حذف الصورة ✕
                                </button>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputOverlayRef}
                            accept="image/*"
                            className="hidden"
                            onChange={handleUploadOverlay}
                        />

                        {!overlaySrc ? (
                            <div className="space-y-2">
                                <button
                                    onClick={() => fileInputOverlayRef.current?.click()}
                                    className="btn-gold w-full py-2.5 text-xs font-bold shadow cursor-pointer"
                                >
                                    ➕ إدراج صورة من جهازك (شخصية / شعار / رمز)
                                </button>
                                <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                                    <span>أو اختر صورة جاهزة للدمج:</span>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => {
                                                setOverlaySrc(wp.src);
                                                setActiveDragItem("overlay");
                                            }}
                                            className="chip py-0.5 text-[11px]"
                                        >
                                            تكرار المعلم
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 pt-1">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => fileInputOverlayRef.current?.click()}
                                        className="chip py-1 text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        تغيير الصورة 🔄
                                    </button>
                                    <button
                                        onClick={() => setActiveDragItem("overlay")}
                                        className={activeDragItem === "overlay" ? "chip chip-active text-xs" : "chip text-xs"}
                                    >
                                        🎯 تفعيل السحب للصورة
                                    </button>
                                </div>

                                {/* شكل الصورة وإطارها */}
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setOverlayShape("circle")}
                                        className={overlayShape === "circle" ? "chip chip-active text-xs" : "chip text-xs"}
                                    >
                                        ⭕ دائري
                                    </button>
                                    <button
                                        onClick={() => setOverlayShape("rounded")}
                                        className={overlayShape === "rounded" ? "chip chip-active text-xs" : "chip text-xs"}
                                    >
                                        🔲 زوايا ناعمة
                                    </button>
                                    <button
                                        onClick={() => setOverlayShape("rect")}
                                        className={overlayShape === "rect" ? "chip chip-active text-xs" : "chip text-xs"}
                                    >
                                        ⏹️ أصلي
                                    </button>
                                </div>

                                {/* حجم وتدوير الصورة المضافة */}
                                <label className="block">
                                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                        <span>حجم الصورة المضافة</span>
                                        <span>{Math.round(overlayScale * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={15}
                                        max={100}
                                        value={Math.round(overlayScale * 100)}
                                        onChange={(e) => setOverlayScale(+e.target.value / 100)}
                                        className="w-full accent-primary"
                                    />
                                </label>

                                <label className="block">
                                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                        <span>زاوية التدوير</span>
                                        <span>{overlayRotation}°</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={-180}
                                        max={180}
                                        value={overlayRotation}
                                        onChange={(e) => setOverlayRotation(+e.target.value)}
                                        className="w-full accent-primary"
                                    />
                                </label>

                                <label className="block">
                                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                        <span>شفافية الصورة المضافة</span>
                                        <span>{Math.round(overlayOpacity * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={15}
                                        max={100}
                                        value={Math.round(overlayOpacity * 100)}
                                        onChange={(e) => setOverlayOpacity(+e.target.value / 100)}
                                        className="w-full accent-primary"
                                    />
                                </label>

                                {/* إطار الصورة المضافة */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/60 p-2">
                                        <span>لون الإطار</span>
                                        <select
                                            value={overlayBorderColor}
                                            onChange={(e) => setOverlayBorderColor(e.target.value)}
                                            className="bg-transparent text-xs outline-none cursor-pointer font-bold"
                                        >
                                            <option value="gold" className="bg-card">ذهبي</option>
                                            <option value="white" className="bg-card">أبيض</option>
                                            <option value="black" className="bg-card">أسود</option>
                                            <option value="none" className="bg-card">بدون</option>
                                        </select>
                                    </div>
                                    <label className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 p-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={overlayShadow}
                                            onChange={(e) => setOverlayShadow(e.target.checked)}
                                            className="accent-primary"
                                        />
                                        <span>ظل ثلاثي الأبعاد</span>
                                    </label>
                                </div>

                                {/* ترتيب الطبقات والمزج */}
                                {wp.fg && (
                                    <label className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-2.5 cursor-pointer text-xs">
                                        <span>وضع الصورة خلف المعلم ✦</span>
                                        <input
                                            type="checkbox"
                                            checked={overlayBehindLandmark}
                                            onChange={(e) => setOverlayBehindLandmark(e.target.checked)}
                                            className="h-4 w-4 accent-primary"
                                        />
                                    </label>
                                )}
                            </div>
                        )}
                    </div>

                    {/* تحرير النص والخط */}
                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <span className="field-label mb-0 font-bold text-foreground">النص المكتوب</span>
                            <button
                                onClick={() => setActiveDragItem("text")}
                                className={activeDragItem === "text" ? "chip chip-active text-[11px] py-0.5" : "chip text-[11px] py-0.5"}
                            >
                                🎯 تفعيل سحب النص
                            </button>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={2}
                            className="field"
                            placeholder="اكتب عبارتك أو اختر من الأسفل..."
                        />
                        <div className="mt-2 flex max-h-24 flex-wrap gap-1.5 overflow-y-auto pt-1">
                            {QUOTE_CATEGORIES[quoteTab].map((q) => (
                                <button key={q} onClick={() => setText(q)} className="chip py-1 text-xs">{q}</button>
                            ))}
                        </div>
                    </div>

                    {/* خيارات الخط */}
                    <div>
                        <span className="field-label font-bold text-foreground">نوع الخط العربي</span>
                        <div className="flex flex-wrap gap-1.5">
                            {FONTS.map((f) => (
                                <button
                                    key={f.family}
                                    onClick={() => setFont(f.family)}
                                    style={{ fontFamily: f.family }}
                                    className={f.family === font ? "chip chip-active text-sm" : "chip text-sm"}
                                >
                                    {f.name}
                                </button>
                            ))}
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <label className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-1.5">
                                <span className="text-xs">لون الخط</span>
                                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-7 w-10 cursor-pointer rounded border-0 bg-transparent" />
                            </label>
                            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-1.5">
                                <span className="text-xs">إطار الخط</span>
                                <select
                                    value={strokeColor}
                                    onChange={(e) => setStrokeColor(e.target.value)}
                                    className="bg-transparent text-xs outline-none cursor-pointer font-bold"
                                >
                                    <option value="gold" className="bg-card">مذهّب</option>
                                    <option value="black" className="bg-card">أسود</option>
                                    <option value="white" className="bg-card">أبيض</option>
                                    <option value="none" className="bg-card">بدون</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* تبديل الخلفية */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="field-label mb-0 font-bold text-foreground">الخلفية الأساسية</span>
                            <input
                                type="file"
                                ref={fileInputBgRef}
                                accept="image/*"
                                className="hidden"
                                onChange={handleUploadBg}
                            />
                            <button
                                onClick={() => fileInputBgRef.current?.click()}
                                className="text-xs text-primary hover:underline cursor-pointer"
                            >
                                📁 رفع خلفية من جهازك
                            </button>
                        </div>
                        <div className="grid max-h-32 grid-cols-6 gap-1.5 overflow-y-auto rounded-lg border border-border/50 p-1.5">
                            {WALLPAPERS.map((w) => (
                                <button
                                    key={w.id}
                                    title={w.title}
                                    onClick={() => {
                                        setBgId(w.id);
                                        setCustomBg(null);
                                    }}
                                    className={`overflow-hidden rounded-md border-2 transition ${w.id === bgId && !customBg ? "border-primary scale-105" : "border-transparent opacity-75 hover:opacity-100"}`}
                                >
                                    <WallpaperThumb wp={w} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* مؤثرات وضبط دقيق */}
                    <div className="space-y-3 pt-1">
                        <label className="block">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>حجم الخط</span>
                                <span>{size}%</span>
                            </div>
                            <input type="range" min={8} max={45} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-primary" />
                        </label>

                        <label className="block">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>تعتيم الخلفية (Dimming)</span>
                                <span>{dim}%</span>
                            </div>
                            <input type="range" min={0} max={80} value={dim} onChange={(e) => setDim(+e.target.value)} className="w-full accent-primary" />
                        </label>

                        <label className="block">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>ضبابية الخلفية (Depth Blur)</span>
                                <span>{blur}px</span>
                            </div>
                            <input type="range" min={0} max={20} value={blur} onChange={(e) => setBlur(+e.target.value)} className="w-full accent-primary" />
                        </label>

                        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                            <label className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer">
                                <input type="checkbox" checked={vignette} onChange={(e) => setVignette(e.target.checked)} className="accent-primary" />
                                <span>تعتيم الأطراف السينمائي</span>
                            </label>
                            <label className="flex items-center gap-2 rounded-lg border border-border p-2 cursor-pointer">
                                <input type="checkbox" checked={watermark} onChange={(e) => setWatermark(e.target.checked)} className="accent-primary" />
                                <span>توقيع «حمزة»</span>
                            </label>
                        </div>
                    </div>

                    {/* زر التصدير والتحميل بدقة كاملة */}
                    <button
                        className="btn-gold w-full py-3.5 text-base shadow-glow cursor-pointer font-bold"
                        onClick={() =>
                            downloadUrl(
                                canvasRef.current!.toDataURL(device.round ? "image/png" : "image/jpeg", 0.98),
                                `hamza-pro-design-${device.id}.${device.round ? "png" : "jpg"}`
                            )
                        }
                    >
                        تنزيل التصميم الكامل بدقة {device.name} 📥
                    </button>
                </aside>
            </main>
        </div>
    );
}