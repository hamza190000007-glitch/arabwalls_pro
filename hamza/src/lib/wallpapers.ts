import w1 from "@/assets/w1.jpg";
import w2 from "@/assets/w2.jpg";
import w3 from "@/assets/w3.jpg";
import w4 from "@/assets/w4.jpg";
import w5 from "@/assets/w5.jpg";
import w6 from "@/assets/w6.jpg";
import kaaba from "@/assets/kaaba.jpg";
import nabawi from "@/assets/nabawi.jpg";
import umDam from "@/assets/umayyad-damascus.jpg";
import umAlep from "@/assets/umayyad-aleppo.jpg";
import sword from "@/assets/sword.jpg";
import damCit from "@/assets/damascus-citadel.jpg";
import alepCit from "@/assets/aleppo-citadel.jpg";
import palmyra from "@/assets/palmyra.jpg";
import skySunset from "@/assets/sky-sunset.jpg";
import skyNight from "@/assets/sky-night.jpg";
import fgClock from "@/assets/fg-clock.png";
import fgNabawi from "@/assets/fg-nabawi.png";
import fgAleppo from "@/assets/fg-aleppo.png";

export type Foreground = { src: string; width: number; align: "center" | "right" | "left" };

export type Wallpaper = {
    id: string;
    src: string;
    title: string;
    category: string;
    fg?: Foreground;
};

export const CATEGORIES = [
    "الكل",
    "خلف المعلم ✦",
    "الحرمين",
    "معالم سورية",
    "زخارف",
    "طبيعة",
    "ليل",
    "بسيطة",
] as const;

export const WALLPAPERS: Wallpaper[] = [
    { id: "d-clock-night", src: skyNight, title: "ساعة مكة — ليل", category: "خلف المعلم ✦", fg: { src: fgClock, width: 0.62, align: "center" } },
    { id: "d-clock-sunset", src: skySunset, title: "ساعة مكة — غروب", category: "خلف المعلم ✦", fg: { src: fgClock, width: 0.62, align: "center" } },
    { id: "d-nabawi", src: skySunset, title: "المسجد النبوي — غروب", category: "خلف المعلم ✦", fg: { src: fgNabawi, width: 0.8, align: "center" } },
    { id: "d-nabawi-night", src: skyNight, title: "المسجد النبوي — ليل", category: "خلف المعلم ✦", fg: { src: fgNabawi, width: 0.8, align: "center" } },
    { id: "d-aleppo", src: skySunset, title: "قلعة حلب — غروب", category: "خلف المعلم ✦", fg: { src: fgAleppo, width: 1, align: "right" } },
    { id: "d-aleppo-night", src: skyNight, title: "قلعة حلب — ليل", category: "خلف المعلم ✦", fg: { src: fgAleppo, width: 1, align: "right" } },
    { id: "kaaba", src: kaaba, title: "الكعبة المشرفة والساعة", category: "الحرمين" },
    { id: "nabawi", src: nabawi, title: "المسجد النبوي", category: "الحرمين" },
    { id: "um-dam", src: umDam, title: "الجامع الأموي — دمشق", category: "معالم سورية" },
    { id: "um-alep", src: umAlep, title: "الجامع الأموي — حلب", category: "معالم سورية" },
    { id: "dam-cit", src: damCit, title: "قلعة دمشق", category: "معالم سورية" },
    { id: "alep-cit", src: alepCit, title: "قلعة حلب", category: "معالم سورية" },
    { id: "palmyra", src: palmyra, title: "تدمر", category: "معالم سورية" },
    { id: "sword", src: sword, title: "السيف الدمشقي", category: "معالم سورية" },
    { id: "w1", src: w1, title: "زخرفة إسلامية مذهبة", category: "زخارف" },
    { id: "w2", src: w2, title: "غروب الصحراء", category: "طبيعة" },
    { id: "w5", src: w5, title: "فناء الياسمين الشامي", category: "طبيعة" },
    { id: "w3", src: w3, title: "ليلة الهلال والمجرة", category: "ليل" },
    { id: "w4", src: w4, title: "مخطوطة حبر وورق", category: "بسيطة" },
    { id: "w6", src: w6, title: "سماء كحلية مذهبة", category: "بسيطة" },
];

export type Device = {
    id: string;
    name: string;
    w: number;
    h: number;
    kind: "phone" | "watch" | "uhd";
    round?: boolean;
};

export const DEVICES: Device[] = [
    // هواتف آيفون
    { id: "iphone-16-max", name: "iPhone 16 / 15 Pro Max", w: 1290, h: 2796, kind: "phone" },
    { id: "iphone-16-pro", name: "iPhone 16 / 15 Pro", w: 1179, h: 2556, kind: "phone" },
    { id: "iphone-base", name: "iPhone 16 / 15 / 14 / 13", w: 1170, h: 2532, kind: "phone" },
    { id: "iphone-se", name: "iPhone SE / 8", w: 750, h: 1334, kind: "phone" },

    // هواتف أندرويد
    { id: "s-ultra-25", name: "Samsung S25 / S24 Ultra", w: 1440, h: 3120, kind: "phone" },
    { id: "pixel-9-pro", name: "Google Pixel 9 / 8 Pro", w: 1344, h: 2992, kind: "phone" },
    { id: "android-fhd", name: "أندرويد قياسي FHD+", w: 1080, h: 2400, kind: "phone" },
    { id: "android-qhd", name: "أندرويد فائق QHD+", w: 1440, h: 3200, kind: "phone" },
    { id: "flip-cover", name: "شاشة الغلاف Galaxy Flip", w: 720, h: 748, kind: "phone" },

    // دقة فائقة 4K
    { id: "uhd-4k", name: "دقة فائقة 4K Ultra HD", w: 2160, h: 3840, kind: "uhd" },
    { id: "classic-story", name: "قياسي 9:16 ستوري", w: 1080, h: 1920, kind: "uhd" },

    // ساعات ذكية
    { id: "aw-ultra", name: "Apple Watch Ultra (49mm)", w: 410, h: 502, kind: "watch" },
    { id: "aw-45", name: "Apple Watch 45-46mm", w: 396, h: 484, kind: "watch" },
    { id: "aw-41", name: "Apple Watch 41-42mm", w: 352, h: 430, kind: "watch" },
    { id: "galaxy-w", name: "Galaxy Watch 7/6 (دائرية)", w: 480, h: 480, kind: "watch", round: true },
    { id: "pixel-w", name: "Pixel Watch 3/2 (دائرية)", w: 456, h: 456, kind: "watch", round: true },
    { id: "huawei-w", name: "Huawei Watch GT (دائرية)", w: 466, h: 466, kind: "watch", round: true },
];

export const QUOTE_CATEGORIES = {
    azkar: [
        "إنّ مع العسر يسرا",
        "ألا بذكر الله تطمئن القلوب",
        "وما توفيقي إلا بالله",
        "سبحان الله وبحمده سبحان الله العظيم",
        "اللهم صلِّ وسلِّم على نبينا محمد",
        "حسبي الله لا إله إلا هو عليه توكلت",
        "لا حول ولا قوة إلا بالله",
        "فاصبر صبراً جميلاً",
        "لبيك اللهم لبيك",
    ],
    sham: [
        "الشام شامة الدنيا ومهد الحضارات",
        "سلامٌ على حلب الشهباء",
        "دمشق الياسمين والأصالة",
        "يا شام عاد الصيف وانبسط الفجر",
        "بردى يفيض محبةً وسناءَ",
    ],
    wisdom: [
        "على قدر أهل العزم تأتي العزائم",
        "ضاقت فلما استحكمت حلقاتها فُرِجَت",
        "الصبر مفتاح الفرج",
        "من سار على الدرب وصل",
        "ما أضيق العيش لولا فسحة الأمل",
    ],
    signature: [
        "حمزة",
        "أبو حمزة",
        "طابَ يومكم بذكر الله",
        "الحمد لله دائماً وأبداً",
    ],
};

export const FONTS = [
    { name: "أميري (نسخ فاخر)", family: "Amiri" },
    { name: "رقعة أصيل", family: "Aref Ruqaa" },
    { name: "كوفي حديث", family: "Reem Kufi" },
    { name: "القاهرة عصري", family: "Cairo" },
    { name: "لطيف كلاسيكي", family: "Lateef" },
];