import type { Wallpaper } from "./wallpapers";

const cache = new Map<string, Promise<HTMLImageElement>>();
export function loadImage(src: string) {
    if (!cache.has(src)) {
        cache.set(
            src,
            new Promise((res, rej) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => res(img);
                img.onerror = rej;
                img.src = src;
            }),
        );
    }
    return cache.get(src)!;
}

function drawCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    W: number,
    H: number,
    focusY = 0.5,
) {
    const s = Math.max(W / img.width, H / img.height);
    const w = img.width * s;
    const h = img.height * s;
    ctx.drawImage(img, (W - w) / 2, (H - h) * focusY, w, h);
}

export type TextOpts = {
    text: string;
    font: string;
    size: number;
    color: string;
    strokeColor?: string;
    strokeWidth?: number;
    shadowBlur?: number;
    shadowColor?: string;
    opacity?: number;
    x: number;
    y: number;
    behind: boolean;
};

// نوع بيانات الصورة المضافة فوق الخلفية
export type OverlayImageOpts = {
    src: string;
    x: number; // 0..1
    y: number; // 0..1
    scale: number; // 0.1 .. 1.2
    rotation: number; // -180 .. 180
    opacity: number; // 0.1 .. 1
    shape: "rect" | "circle" | "rounded";
    borderColor?: string;
    borderWidth?: number;
    shadow?: boolean;
    blendMode?: GlobalCompositeOperation;
    behindLandmark?: boolean;
};

export type RenderOpts = {
    wp: Wallpaper;
    customImgSrc?: string;
    W: number;
    H: number;
    dim: number;
    blur?: number;
    vignette?: boolean;
    goldenWarmth?: number;
    gradientOverlay?: "none" | "bottom" | "top" | "both";
    text?: TextOpts;
    overlay?: OverlayImageOpts;
    watermark?: boolean;
    watermarkText?: string;
};

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
    const lines: string[] = [];
    for (const para of text.split("\n")) {
        let line = "";
        for (const word of para.split(" ")) {
            const t = line ? line + " " + word : word;
            if (ctx.measureText(t).width > max && line) {
                lines.push(line);
                line = word;
            } else line = t;
        }
        lines.push(line);
    }
    return lines;
}

function drawText(ctx: CanvasRenderingContext2D, W: number, H: number, t: TextOpts) {
    if (!t.text.trim()) return;
    const px = Math.round((t.size / 100) * W);
    ctx.save();
    ctx.font = `bold ${px}px "${t.font}", "Cairo", sans-serif`;
    ctx.direction = "rtl";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (t.opacity !== undefined) {
        ctx.globalAlpha = Math.max(0.1, Math.min(1, t.opacity));
    }

    ctx.shadowColor = t.shadowColor || "rgba(0,0,0,0.75)";
    ctx.shadowBlur = (t.shadowBlur ?? 15) * (W / 1080);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4 * (W / 1080);

    const lines = wrap(ctx, t.text, W * 0.88);
    const lh = px * 1.5;
    const start = t.y * H - ((lines.length - 1) * lh) / 2;

    lines.forEach((l, i) => {
        const yPos = start + i * lh;
        if (t.strokeWidth && t.strokeWidth > 0 && t.strokeColor) {
            ctx.strokeStyle = t.strokeColor;
            ctx.lineWidth = t.strokeWidth * (W / 1080);
            ctx.lineJoin = "round";
            ctx.strokeText(l, t.x * W, yPos);
        }
        ctx.fillStyle = t.color;
        ctx.fillText(l, t.x * W, yPos);
    });

    ctx.restore();
}

// دالة رسم وتحرير الصورة المضافة فوق الخلفية
function drawOverlay(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    ov: OverlayImageOpts,
    img: HTMLImageElement,
) {
    ctx.save();
    const cx = ov.x * W;
    const cy = ov.y * H;
    const baseWidth = W * ov.scale;
    const aspect = img.height / img.width;
    const baseHeight = baseWidth * aspect;

    ctx.translate(cx, cy);
    ctx.rotate((ov.rotation * Math.PI) / 180);
    ctx.globalAlpha = ov.opacity ?? 1;

    if (ov.blendMode) {
        ctx.globalCompositeOperation = ov.blendMode;
    }

    if (ov.shadow) {
        ctx.shadowColor = "rgba(0,0,0,0.65)";
        ctx.shadowBlur = 25 * (W / 1080);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 8 * (W / 1080);
    }

    // القص الدائري أو الزوايا المنحنية
    if (ov.shape === "circle") {
        ctx.beginPath();
        const radius = Math.min(baseWidth, baseHeight) / 2;
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
    } else if (ov.shape === "rounded") {
        ctx.beginPath();
        const r = Math.min(baseWidth, baseHeight) * 0.15;
        if ("roundRect" in ctx) {
            (ctx as any).roundRect(-baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight, r);
        } else {
            ctx.rect(-baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
        }
        ctx.clip();
        ctx.drawImage(img, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
    } else {
        ctx.drawImage(img, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
    }

    // رسم إطار الصورة المضافة
    if (ov.borderWidth && ov.borderWidth > 0 && ov.borderColor) {
        ctx.lineWidth = ov.borderWidth * (W / 1080);
        ctx.strokeStyle = ov.borderColor;
        if (ov.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, Math.min(baseWidth, baseHeight) / 2, 0, Math.PI * 2);
            ctx.stroke();
        } else if (ov.shape === "rounded") {
            ctx.beginPath();
            const r = Math.min(baseWidth, baseHeight) * 0.15;
            if ("roundRect" in ctx) {
                (ctx as any).roundRect(-baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight, r);
            } else {
                ctx.rect(-baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
            }
            ctx.stroke();
        } else {
            ctx.strokeRect(-baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
        }
    }

    ctx.restore();
}

export async function renderWallpaper(canvas: HTMLCanvasElement, o: RenderOpts) {
    const { wp, W, H } = o;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const bgSource = o.customImgSrc || wp.src;
    const bg = await loadImage(bgSource);
    const fg = !o.customImgSrc && wp.fg ? await loadImage(wp.fg.src) : null;
    const overlayImg = o.overlay?.src ? await loadImage(o.overlay.src) : null;

    if (o.text) {
        await document.fonts.load(`40px "${o.text.font}"`).catch(() => { });
    }

    ctx.clearRect(0, 0, W, H);

    // ضبابية الخلفية
    if (o.blur && o.blur > 0) {
        ctx.save();
        ctx.filter = `blur(${o.blur * (W / 1080)}px)`;
        drawCover(ctx, bg, W, H);
        ctx.restore();
    } else {
        drawCover(ctx, bg, W, H);
    }

    // التعتيم العام
    if (o.dim > 0) {
        ctx.fillStyle = `rgba(0,0,0,${o.dim / 100})`;
        ctx.fillRect(0, 0, W, H);
    }

    // الدفء الذهبي
    if (o.goldenWarmth && o.goldenWarmth > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(212, 175, 55, ${(o.goldenWarmth / 100) * 0.25})`;
        ctx.globalCompositeOperation = "color-dodge";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
    }

    // تدرجات شاشة القفل لحماية الودجات والساعة
    if (o.gradientOverlay && o.gradientOverlay !== "none") {
        ctx.save();
        if (o.gradientOverlay === "top" || o.gradientOverlay === "both") {
            const topGrad = ctx.createLinearGradient(0, 0, 0, H * 0.35);
            topGrad.addColorStop(0, "rgba(0,0,0,0.65)");
            topGrad.addColorStop(1, "transparent");
            ctx.fillStyle = topGrad;
            ctx.fillRect(0, 0, W, H * 0.35);
        }
        if (o.gradientOverlay === "bottom" || o.gradientOverlay === "both") {
            const btmGrad = ctx.createLinearGradient(0, H * 0.65, 0, H);
            btmGrad.addColorStop(0, "transparent");
            btmGrad.addColorStop(1, "rgba(0,0,0,0.7)");
            ctx.fillStyle = btmGrad;
            ctx.fillRect(0, H * 0.65, W, H * 0.35);
        }
        ctx.restore();
    }

    // تعتيم الأطراف السينمائي
    if (o.vignette) {
        ctx.save();
        const radGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, Math.max(W, H) * 0.7);
        radGrad.addColorStop(0, "rgba(0,0,0,0)");
        radGrad.addColorStop(1, "rgba(0,0,0,0.6)");
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
    }

    const drawFg = () => {
        if (!fg || !wp.fg || o.customImgSrc) return;
        let w = W * wp.fg.width;
        let h = (fg.height / fg.width) * w;
        if (h > H * 0.85) {
            h = H * 0.85;
            w = (fg.width / fg.height) * h;
        }
        const x = wp.fg.align === "center" ? (W - w) / 2 : wp.fg.align === "right" ? W - w : 0;
        ctx.drawImage(fg, x, H - h, w, h);
    };

    const renderOverlayLayer = () => {
        if (overlayImg && o.overlay) {
            drawOverlay(ctx, W, H, o.overlay, overlayImg);
        }
    };

    // ترتيب الطبقات (العمق ثلاثي الأبعاد)
    if (o.overlay?.behindLandmark && fg) {
        renderOverlayLayer();
    }

    if (o.text?.behind && fg && !o.customImgSrc) {
        if (o.text.text) drawText(ctx, W, H, o.text);
        drawFg();
    } else {
        drawFg();
        if (o.text?.text) drawText(ctx, W, H, o.text);
    }

    if (!o.overlay?.behindLandmark || !fg) {
        renderOverlayLayer();
    }

    // التوقيع الاختياري
    if (o.watermark) {
        ctx.save();
        ctx.font = `${Math.round(W * 0.032)}px "Reem Kufi", "Cairo", sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.fillText(o.watermarkText || "حمزة", W / 2, H - W * 0.05);
        ctx.restore();
    }
}

export async function wallpaperDataUrl(wp: Wallpaper, W = 1080, H = 1920) {
    const c = document.createElement("canvas");
    await renderWallpaper(c, { wp, W, H, dim: 0 });
    return c.toDataURL("image/jpeg", 0.95);
}